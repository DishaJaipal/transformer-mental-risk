import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv("../data/processed/full_goemotions_1.csv")
labels = df["depressed"].values

embeddings = np.load("../data/processed/bert_embeddings.npy")

X_train, X_test, y_train, y_test = train_test_split(
    embeddings, labels, test_size=0.2, random_state=42, stratify=labels
)

rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=100,
    random_state=0,
    criterion="gini",
    verbose=0,
    class_weight=None,
    n_jobs=-1,
)
rf.fit(X_train, y_train)

rf_prob_features = rf.predict_proba(embeddings)

np.save("../data/processed/rf_prob_features.npy", rf_prob_features)
np.save("../data/processed/labels.npy", labels)
import joblib

joblib.dump(rf, "../models/random_forest.pkl")
