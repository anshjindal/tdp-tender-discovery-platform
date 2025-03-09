import fitz  # PyMuPDF
import docx
import os

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text("text") + "\n"
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
    return text

def extract_text_from_docx(docx_path):
    """Extracts text from a DOCX file."""
    text = ""
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error extracting text from {docx_path}: {e}")
    return text

def extract_text(file_path, output_file=None):
    """Determines file type and extracts text accordingly. Optionally saves to an output file."""
    if file_path.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")
    
    if output_file:
        try:
            with open(output_file, "w", encoding="utf-8") as out:
                out.write(text)
        except Exception as e:
            print(f"Error saving text to {output_file}: {e}")
    
    return text
