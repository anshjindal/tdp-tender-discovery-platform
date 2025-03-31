from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

import spacy
from spacy_layout import spaCyLayout

nlp = spacy.load("en_core_web_lg")
layout = spaCyLayout(nlp)

def load_capability_keywords():
    """Load capability keywords from a configuration file or database."""

    try:
        with open("capabilities.txt", "r") as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return ["tech services", "maintenance", "web design", "IT support", "cloud services"]

capability_keywords = load_capability_keywords()

def match_keywords(text):
    """Match document text against capability keywords."""
    matched = [kw for kw in capability_keywords if kw.lower() in text.lower()]
    if matched:
        verdict = "Yes, we are capable of doing this tender"
        explanation = f"Matched keywords: {', '.join(matched)}"
    else:
        verdict = "No, we are not capable of this tender"
        explanation = "No relevant keywords found"
    return verdict, explanation, matched

def log_assessment(filename, verdict, explanation):
    """Log the verdict and explanation to a file for auditing."""
    with open("rfp_logs.txt", "a", encoding="utf-8") as f:
        log_entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "filename": filename,
            "verdict": verdict,
            "explanation": explanation
        }
        f.write(f"{str(log_entry)}\n")

@app.route('/analyze_pdf', methods=['POST'])
def upload_pdf():
    try:
        start_time = datetime.now()
        
        file = request.files['pdf']
        filename = file.filename
        pdf_data = file.read()
        
        doc = layout(pdf_data)

        analyzed_doc = nlp(doc.text)
        sentences_with_dates = [sent.text for sent in analyzed_doc.sents if any(ent.label_ == "DATE" for ent in sent.ents)]
        sentences_with_money = [sent.text for sent in analyzed_doc.sents if any(ent.label_ == "MONEY" for ent in sent.ents)]
        entities = [(ent.text, ent.label_) for ent in analyzed_doc.ents]

        verdict, explanation, matched_keywords = match_keywords(doc.text)

        log_assessment(filename, verdict, explanation)
        
        processing_time = (datetime.now() - start_time).total_seconds()

        return jsonify({
            "sentences_with_dates": sentences_with_dates,
            "sentences_with_money": sentences_with_money,
            "entities": entities,
            "verdict": verdict,
            "explanation": explanation,
            "matched_keywords": matched_keywords,
            "processing_time_seconds": processing_time
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to analyze document"
        }), 500

@app.route('/', methods=['GET'])
def home():
    return "hello!"

if __name__ == '__main__':
    port = int(os.getenv("PORT", 4500))
    app.run(host='0.0.0.0', port=port, debug=True)