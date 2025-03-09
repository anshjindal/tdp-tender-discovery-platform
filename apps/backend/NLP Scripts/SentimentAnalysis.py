import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download the VADER sentiment model if not already installed
nltk.download("vader_lexicon")

# Initialize Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

# Load the filtered sentences
def load_sentences(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return [line.strip() for line in file.readlines() if line.strip()]

# Analyze sentiment
def analyze_sentiment(sentences):
    results = []
    for sent in sentences:
        score = sia.polarity_scores(sent)["compound"]  # Get sentiment score
        sentiment = "Positive" if score > 0.2 else "Negative" if score < -0.2 else "Neutral"
        results.append((sent, sentiment, score))
    return results


def sentiment_analysis_runner(input_file, output_file):
    
    # Load filtered sentences
    filtered_sentences = load_sentences(input_file)

    # Get sentiment results
    sentiment_results = analyze_sentiment(filtered_sentences)

    # Save results
    with open(output_file, "w", encoding="utf-8") as output_file:
        for sent, sentiment, score in sentiment_results:
            output_file.write(f"[{sentiment} | {score}] {sent}\n")
