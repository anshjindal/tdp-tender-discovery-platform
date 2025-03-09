import nltk
from nltk import word_tokenize, pos_tag, ne_chunk
nltk.download("punkt")
nltk.download("maxent_ne_chunker")
nltk.download("words")

def load_sentences(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return [line.strip() for line in file.readlines() if line.strip()]

def extract_named_entities_nltk(sentences):
    entities = []
    for sent in sentences:
        tree = ne_chunk(pos_tag(word_tokenize(sent)))
        for subtree in tree:
            if hasattr(subtree, 'label'):
                entity = " ".join([token for token, _ in subtree.leaves()])
                label = subtree.label()
                if label in ["ORGANIZATION", "GPE", "PERSON", "MONEY", "EVENT"]:
                    entities.append((entity, label, sent))
    return entities

def NER_Script_Runner(input_file, output_file):
    filtered_sentences = load_sentences(input_file)
    ner_results = extract_named_entities_nltk(filtered_sentences)
    
    with open(output_file, "w", encoding="utf-8") as output_file:
        for entity, label, sentence in ner_results:
            output_file.write(f"{entity} ({label}): {sentence}\n")