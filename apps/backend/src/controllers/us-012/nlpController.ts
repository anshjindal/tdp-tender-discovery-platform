import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Import your NLP modules using require (using consistent casing for "NLP")
const textExtraction = require('../../NLP/TextExtraction.js');
const tokenizing = require('../../NLP/tokenizing.js');
const NER = require('../../NLP/NER.js');
const sentimentAnalysis = require('../../NLP/SentimentAnalysis.js');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const NLP_RESULTS_DIR = path.join(process.cwd(), 'nlpResults');

// POST /api/v1/documents/extract
export const extractDocumentData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({ success: false, message: 'documentId is required.' });
    }

    const filePath = path.join(UPLOADS_DIR, documentId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Uploaded file not found.' });
    }

    const docResultDir = path.join(NLP_RESULTS_DIR, documentId);
    if (!fs.existsSync(docResultDir)) {
      await mkdir(docResultDir, { recursive: true });
    }

    // 1. Text Extraction:
    const extractedTextOutputPath = path.join(docResultDir, 'extracted.txt');
    const extractedText: string = await textExtraction.extractText(filePath, extractedTextOutputPath);

    // 2. Tokenization:
    const tokenizedSentences: string[] = tokenizing.tokenizeText(extractedText);
    const tokenizedOutputPath = path.join(docResultDir, 'tokenized.txt');
    await writeFile(tokenizedOutputPath, tokenizedSentences.join('\n'), 'utf-8');

    // 3. Named Entity Recognition (NER):
    const nerInputPath = tokenizedOutputPath;
    const nerOutputPath = path.join(docResultDir, 'NER.txt'); // Target output path for NER
    NER.runNER(nerInputPath, nerOutputPath); // Pass output path to runNER
    // const nerOutputOriginalPath = path.join(__dirname, '../../NLP/NER.txt');
    // if (fs.existsSync(nerOutputOriginalPath)) {
    //   fs.copyFileSync(nerOutputOriginalPath, nerOutputPath);
    //   fs.unlinkSync(nerOutputOriginalPath);
    // }

    // 4. Sentiment Analysis:
    const saOutputPath = path.join(docResultDir, 'SA.txt'); // Target output path for sentiment analysis
    sentimentAnalysis.sentimentAnalysisRunner(nerInputPath, saOutputPath); // Pass output path to sentimentAnalysisRunner
    // const saOutputOriginalPath = path.join(__dirname, '../../NLP/SA.txt');
    // if (fs.existsSync(saOutputOriginalPath)) {
    //   fs.copyFileSync(saOutputOriginalPath, saOutputPath);
    //   fs.unlinkSync(saOutputOriginalPath);
    // }

    return res.status(200).json({
      success: true,
      message: 'NLP extraction completed.',
      documentId,
      resultsPath: docResultDir,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/documents/:id/data
export const getExtractedData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documentId = req.params.id;
    const docResultDir = path.join(NLP_RESULTS_DIR, documentId);

    if (!fs.existsSync(docResultDir)) {
      return res.status(404).json({ success: false, message: 'No NLP data found for this document.' });
    }

    const extractedTextPath = path.join(docResultDir, 'extracted.txt');
    const tokenizedPath = path.join(docResultDir, 'tokenized.txt');
    const nerPath = path.join(docResultDir, 'NER.txt');
    const saPath = path.join(docResultDir, 'SA.txt');

    const extractedText = fs.existsSync(extractedTextPath) ? await readFile(extractedTextPath, 'utf-8') : null;
    const tokenizedText = fs.existsSync(tokenizedPath) ? await readFile(tokenizedPath, 'utf-8') : null;
    const nerData = fs.existsSync(nerPath) ? await readFile(nerPath, 'utf-8') : null;
    const sentimentData = fs.existsSync(saPath) ? await readFile(saPath, 'utf-8') : null;

    return res.status(200).json({
      success: true,
      documentId,
      extractedText,
      tokenizedText,
      namedEntities: nerData,
      sentimentAnalysis: sentimentData,
    });
  } catch (err) {
    next(err);
  }
};

