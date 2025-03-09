import re
from pathlib import Path

# Load tokenized sentences
def load_sentences(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        sentences = file.readlines()
    return [s.strip() for s in sentences if s.strip()]

# Search for relevant sentences
def search_sentences(sentences, keywords):
    pattern = re.compile(r'\b(' + '|'.join(keywords) + r')\b', re.IGNORECASE)
    return [s for s in sentences if pattern.search(s)]

def filter_relevant_sentences(input_file, output_file):
    # Define keywords related to technology and company impact
    keywords = ["..."]

    # Load tokenized sentences
    sentences = load_sentences(input_file)
    
    # Search for relevant sentences
    filtered_sentences = search_sentences(sentences, keywords)

    # Save results
    with open(output_file, "w", encoding="utf-8") as output:
        output.write("\n".join(filtered_sentences))

    print(f"Filtered sentences saved to: {output_file}")
