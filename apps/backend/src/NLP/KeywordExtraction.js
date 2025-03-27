import fs from 'fs/promises';

// Load tokenized sentences
async function loadSentences(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    return data.split('\n').map(line => line.trim()).filter(line => line);
}

// Search for relevant sentences
function searchSentences(sentences, keywords) {
    const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
    return sentences.filter(sentence => pattern.test(sentence));
}

// Filter relevant sentences and save
async function filterRelevantSentences(inputFile, outputFile, keywords) {
    const sentences = await loadSentences(inputFile);
    const filteredSentences = searchSentences(sentences, keywords);
    await fs.writeFile(outputFile, filteredSentences.join('\n'), 'utf-8');
    console.log(`Filtered sentences saved to: ${outputFile}`);
}
