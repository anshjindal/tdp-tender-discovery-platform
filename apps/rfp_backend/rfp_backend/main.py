from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app)

import spacy
from spacy_layout import spaCyLayout

nlp = spacy.load("en_core_web_lg")

layout = spaCyLayout(nlp)


@app.route('/analyze_pdf', methods=['POST'])
def upload_pdf():
    file = request.files['pdf']
    pdf_data = file.read()

    # Extract text from PDF
    doc = layout(pdf_data)
    full_text = doc.text.lower()  # Convert to lowercase for easier keyword matching

    # Run NLP for additional analysis (optional but kept for consistency)
    analyzed_doc = nlp(full_text)
    sentences_with_dates = [sent.text for sent in analyzed_doc.sents if any(ent.label_ == "DATE" for ent in sent.ents)]
    sentences_with_money = [sent.text for sent in analyzed_doc.sents if any(ent.label_ == "MONEY" for ent in sent.ents)]
    entities = [(ent.text, ent.label_) for ent in analyzed_doc.ents]

    # Capability keyword matching logic
    KEYWORDS = [
        "tech services",
        "technical support",
        "maintenance",
        "web design",
        "software development",
        "IT infrastructure",
        "cybersecurity",
        "cloud solutions",
        "data analytics",
        "mobile app development"
    ]

    verdict = "No, we are not capable of this tender."
    for keyword in KEYWORDS:
        if keyword.lower() in full_text:
            verdict = "Yes, we are capable of doing this tender."
            break

    return jsonify({
        "sentences_with_dates": sentences_with_dates,
        "sentences_with_money": sentences_with_money,
        "entities": entities,
        "capability_verdict": verdict  # <-- NEW FIELD added
    })

@app.route('/', methods=['GET'])
def home():
    return "hello!"

if __name__ == '__main__':
    
    port = int(os.getenv("PORT", 4500))

    app.run(host='0.0.0.0',
            port=port,
            debug=True)
