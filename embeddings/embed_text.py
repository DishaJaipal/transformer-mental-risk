import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

df = pd.read_csv(r"../data/processed/full_goemotions_1.csv")
texts = df["clean_text"].astype(str).tolist()

bert_model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = bert_model.encode(
    texts, batch_size=32, show_progress_bar=True, convert_to_numpy=True
)
np.save("../data/processed/bert_embeddings.npy", embeddings)
