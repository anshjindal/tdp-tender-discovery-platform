import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';

// Import NLP modules using relative paths with consistent casing
const KeywordExtraction = require('../NLP/KeywordExtraction.js');
const NER = require('../NLP/NER.js');
const SentimentAnalysis = require('../NLP/SentimentAnalysis.js');
const TextExtraction = require('../NLP/TextExtraction.js');
const Tokenizing = require('../NLP/tokenizing.js');

// Define paths
const UPLOADS_DIR = path.join(process.cwd(), 'uploads'); // tdp-tender-discovery-platform/uploads
const NLP_RESULTS_DIR = path.join(process.cwd(), 'nlpResults'); // tdp-tender-discovery-platform/nlpResults

// Utility: process a single file if it has not been processed
async function processFile(filePath: string): Promise<void> {
  const fileName = path.basename(filePath);
  const resultFolder = path.join(NLP_RESULTS_DIR, fileName);

  // If the result folder exists, assume the file has been processed.
  if (fs.existsSync(resultFolder)) {
    console.log(`Skipping already processed file: ${fileName}`);
    return;
  }

  // Create a folder for the NLP results for this file.
  fs.mkdirSync(resultFolder, { recursive: true });
  console.log(`Processing file: ${fileName}`);

  try {
    // 1. Text Extraction:
    const extractedOutputPath = path.join(resultFolder, 'extracted.txt');
    const extractedText: string = await TextExtraction.extractText(filePath, extractedOutputPath);
    console.log(`Text extracted for ${fileName}`);

    // 2. Tokenization:
    const tokenizedSentences: string[] = Tokenizing.tokenizeText(extractedText);
    const tokenizedFilePath = path.join(resultFolder, 'tokenized.txt');
    fs.writeFileSync(tokenizedFilePath, tokenizedSentences.join('\n'), 'utf-8');
    console.log(`Tokenization completed for ${fileName}`);

    // 3. Sentiment Analysis:
    const saTargetPath = path.join(resultFolder, 'SA.txt'); // Target output path for Sentiment Analysis
    SentimentAnalysis.sentimentAnalysisRunner(tokenizedFilePath, saTargetPath); // Pass target path directly
    console.log(`Sentiment analysis completed for ${fileName}`);
    // const saOriginalPath = path.join(__dirname, '../../NLP/SA.txt');
    // const saTargetPath = path.join(resultFolder, 'SA.txt');
    // if (fs.existsSync(saOriginalPath)) {
    //   fs.copyFileSync(saOriginalPath, saTargetPath);
    //   fs.unlinkSync(saOriginalPath);
    //   console.log(`Sentiment analysis completed for ${fileName}`);
    // } else {
    //   console.warn(`Sentiment analysis output not found for ${fileName}`);
    // }

    // 4. Named Entity Recognition:
    const nerTargetPath = path.join(resultFolder, 'NER.txt'); // Target output path for NER
    NER.runNER(tokenizedFilePath, nerTargetPath); // Pass target output path directly
    console.log(`Named Entity Recognition completed for ${fileName}`);
    // const nerOriginalPath = path.join(__dirname, '../../NLP/NER.txt');
    // const nerTargetPath = path.join(resultFolder, 'NER.txt');
    // if (fs.existsSync(nerOriginalPath)) {
    //   fs.copyFileSync(nerOriginalPath, nerTargetPath);
    //   fs.unlinkSync(nerOriginalPath);
    //   console.log(`Named Entity Recognition completed for ${fileName}`);
    // } else {
    //   console.warn(`NER output not found for ${fileName}`);
    // }

    console.log(`Finished processing ${fileName}`);
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error);
  }
}

// Initialize the watcher on the uploads folder
function initNlpWatcher() {
  // Create the NLP_RESULTS_DIR if it doesn't exist
  if (!fs.existsSync(NLP_RESULTS_DIR)) {
    fs.mkdirSync(NLP_RESULTS_DIR, { recursive: true });
  }

  console.log(`Watching for new files in ${UPLOADS_DIR}...`);
  const watcher = chokidar.watch(UPLOADS_DIR, {
    persistent: true,
    ignoreInitial: false, // Process files already present on startup as well
  });

  // On file add event, process the file
  watcher.on('add', (filePath) => {
    processFile(filePath);
  });

  watcher.on('error', (error) => {
    console.error(`Watcher error: ${error}`);
  });

  // Graceful shutdown logic
  function cleanup() {
    console.log('Closing file watcher...');
    watcher.close().then(() => {
      console.log('File watcher closed.');
      process.exit(0); // Exit the process after cleanup
    });
  }

  // Handle process termination signals
  process.on('SIGINT', cleanup); // Ctrl+C
  process.on('SIGTERM', cleanup); // Termination signal
}

// Start the watcher
initNlpWatcher();

