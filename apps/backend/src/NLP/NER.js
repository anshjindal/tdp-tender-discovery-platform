const fs = require('fs');
const nlp = require('compromise');
const path = require('path');

function loadSentences(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '');
}

function extractNamedEntities(sentences) {
    const entities = [];

    sentences.forEach(sent => {
        const doc = nlp(sent);
        const people = doc.people().out('array');
        const places = doc.places().out('array');
        const orgs = doc.organizations().out('array');

        [...people, ...places, ...orgs].forEach(entity => {
            let label = people.includes(entity) ? "PERSON" :
                        places.includes(entity) ? "GPE" : "ORGANIZATION";
            entities.push({ entity, label, sent });
        });
    });

    return entities;
}

function runNER(inputFile, outputFile) {
    const sentences = loadSentences(inputFile);
    const entities = extractNamedEntities(sentences);
    const formatted = entities.map(e => `${e.entity} (${e.label}): ${e.sent}`).join('\n');


    //const outputFileName = `NER.txt`;
    //const outputFilePath = path.join(__dirname, outputFileName);
    const outputFilePath = outputFile || path.join(__dirname, 'NER.txt');

    fs.writeFileSync(outputFilePath, formatted);
    console.log(`NER output saved to: ${outputFilePath}`);
}



module.exports = { extractNamedEntities, runNER };
