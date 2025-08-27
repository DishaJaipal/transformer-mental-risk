import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


df = pd.read_csv(r"../data/processed/full_goemotions_1.csv")

texts = df["clean_text"].astype(str).tolist()
labels = df["depressed"].values

bert_model = SentenceTransformer("all-MiniLM-L6-v2")
