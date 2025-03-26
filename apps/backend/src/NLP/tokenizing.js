const fs = require('fs');
const path = require('path');
const natural = require('natural');

const tokenizer = new natural.SentenceTokenizer();

function tokenizeText(text) {
    try {
        // Read the input text file
        // const text = fs.readFileSync(inputPath, 'utf8');
        return tokenizer.tokenize(text);
    } catch (err) {
        console.error(`Error reading file at ${inputPath}:`, err);
        process.exit(1);
    }
}

function saveTokenizedText(inputPath) {
    const sentences = tokenizeText(inputPath);

    // Generate a unique file name with a timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFileName = `tokenized.txt`;
    const outputFilePath = path.join(__dirname, outputFileName);

    // Write tokenized text to a new file
    fs.writeFileSync(outputFilePath, sentences.join('\n'));
    console.log(`Tokenized sentences saved to: ${outputFilePath}`);
}

module.exports = { tokenizeText, saveTokenizedText };
