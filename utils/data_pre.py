import pandas as pd
from sklearn.model_selection import train_test_split
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download("stopwords")

df1 = pd.read_csv(r"../data/raw/goemotions_1.csv")
df2 = pd.read_csv(r"../data/raw/goemotions_2.csv")
df3 = pd.read_csv(r"../data/raw/goemotions_3.csv")

df = pd.concat([df1, df2, df3], ignore_index=True)
df = df.drop_duplicates(subset=["text"], keep="first")
df = df.reset_index(drop=True)


# def is_depressed(row):
#     for emo in de


# import os

# print(os.path.exists(r"../data/raw/goemotions_1.csv"))
# print(os.listdir("../data/raw"))
NEGATIVE_EMOTIONS = [
    "fear",
    "nervousness",
    "remorse",
    "embarrassment",
    "disappointment",
    "sadness",
    "grief",
    "disgust",
    "anger",
    "annoyance",
    "disapproval",
]


def add_depressed_label(df, negative_cols):
    df["depressed"] = df[negative_cols].max(axis=1)
    return df


df = add_depressed_label(df, NEGATIVE_EMOTIONS)


stop_words = set(stopwords.words("english"))
stemmer = PorterStemmer()


def clean_text(text):
    if pd.isnull(text):
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


df["clean_text"] = df["text"].apply(clean_text)
df = df[df["clean_text"] != ""].dropna(subset=["clean_text"])


# df.to_csv(r"../data/full_goemotions_1.csv", index=False)
# print(df.shape)
