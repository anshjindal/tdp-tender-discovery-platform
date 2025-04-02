const fs = require('fs');
const vader = require('vader-sentiment');
const path = require('path');

function loadSentences(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '');
}

function analyzeSentiment(sentences) {
    return sentences.map(sent => {
        const score = vader.SentimentIntensityAnalyzer.polarity_scores(sent).compound;
        const sentiment = score > 0.2 ? "Positive" : score < -0.2 ? "Negative" : "Neutral";
        return { sent, sentiment, score };
    });
}

function sentimentAnalysisRunner(inputFile, outputFile) {
    const sentences = loadSentences(inputFile);
    const results = analyzeSentiment(sentences);
    const output = results.map(r => `[${r.sentiment} | ${r.score}] ${r.sent}`).join('\n');

    //const outputFileName = `SA.txt`;
    //const outputFilePath = path.join(__dirname, outputFileName);

    const outputFilePath = outputFile || path.join(__dirname, 'SA.txt');
    
    fs.writeFileSync(outputFilePath, output);
    console.log(`Sentiment analysis output saved to: ${outputFilePath}`);
}


module.exports = { analyzeSentiment, sentimentAnalysisRunner };
