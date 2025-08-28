import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, KFold, cross_val_score
import joblib

X = np.load("../data/processed/rf_prob_features.npy")
labels_df = pd.read_csv("../data/processed/full_goemotions_1.csv")
y = labels_df["depressed"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, shuffle=True
)

lr_model = LogisticRegression(random_state=0, max_iter=1000, solver="lbfgs")

kf = KFold(n_splits=10, shuffle=True, random_state=0)
cv_scores = cross_val_score(lr_model, X_train, y_train, cv=kf, scoring="accuracy")

print("10-Fold CV Accuracy Scores:", cv_scores)
print("Mean CV Accuracy:", np.mean(cv_scores))

lr_model.fit(X_train, y_train)

test_accuracy = lr_model.score(X_test, y_test)
print("Test Set Accuracy:", test_accuracy)

with open("../models/final_classifier.pkl", "wb") as f:
    joblib.dump(lr_model, f)
