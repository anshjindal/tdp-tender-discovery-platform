const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromPDF(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
}

async function extractTextFromDOCX(docxPath) {
    const dataBuffer = await fs.readFile(docxPath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value;
}

async function extractText(filePath, outputFile = null) {
    let text = '';
    if (filePath.endsWith('.pdf')) {
        text = await extractTextFromPDF(filePath);
    } else if (filePath.endsWith('.docx')) {
        text = await extractTextFromDOCX(filePath);
    } else {
        throw new Error('Unsupported file format. Only PDF and DOCX are supported.');
    }
    
    if (outputFile) {
        await fs.writeFile(outputFile, text, 'utf-8');
    }
    return text;
}

// Change module export to CommonJS syntax
module.exports = { extractText };
