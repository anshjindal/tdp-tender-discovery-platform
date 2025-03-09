import nltk
from nltk.tokenize import word_tokenize, sent_tokenize

# Download tokenizer data if not already available
nltk.download("punkt")
nltk.download('punkt_tab')

def tokenize_text(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()

    # Tokenize sentences
    sentences = sent_tokenize(text)


    return sentences

# Save tokenized output
def save_tokenized_text(input_file, output_sentences, output_words):
    sentences, words = tokenize_text(input_file)

    with open(output_sentences, "w", encoding="utf-8") as file:
        file.write("\n".join(sentences))


    print(f"Tokenized sentences saved to: {output_sentences}")

