import numpy as np
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sentence_transformers import SentenceTransformer


nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
stemmer = PorterStemmer()


def clean_text(text):
    if text is None:
        return ""
    text = str(text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", "", text)
    text = re.sub(r"\b\d{1,2}:\d{2}(?:am|pm|AM|PM)?\b", "", text)
    text = re.sub(r"\d+", "", text)
    emoji_pattern = re.compile(
        "["
        "\U0001f600-\U0001f64f"  # emoticons
        "\U0001f300-\U0001f5ff"  # symbols & pictographs
        "\U0001f680-\U0001f6ff"  # transport & map symbols
        "\U0001f1e0-\U0001f1ff"  # flags
        "\U00002700-\U000027bf"  # dingbats
        "\U0001f900-\U0001f9ff"  # supplemental symbols
        "]+",
        flags=re.UNICODE,
    )
    text = emoji_pattern.sub(r"", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    text = text.lower()
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    text = " ".join(words)
    return text


bert_model = SentenceTransformer("All-MiniLM-L6-v2")

rf = joblib.load("../models/random_forest.pkl")
clf = joblib.load("../models/final_classifier.pkl")


def predict_emotion(text: str) -> dict:
    cleaned = clean_text(text)
    emb = bert_model.encode([cleaned])
    rf_features = rf.predict_proba(emb)
    pred = clf.predict(rf_features)[0]
    prob = clf.predict_proba(rf_features)[0]

    return {
        "input": text,
        "clean_text": cleaned,
        "prediction": int(pred),  # 0 = Not Depressed, 1 = Depressed
        "confidence": float(np.max(prob)),  # max confidence
        "probabilities": {"not_depressed": float(prob[0]), "depressed": float(prob[1])},
    }
