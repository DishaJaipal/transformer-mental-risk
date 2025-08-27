import numpy as np
import pickle
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import cross_val_score, StratifiedKFold

# Load features and labels
X = np.load("data/processed/rf_prob_features.npy")
y = np.load("data/processed/labels.npy")

# Load trained final classifier
with open("models/final_classifier.pkl", "rb") as f:
    clf = pickle.load(f)

# Define cross-validation
kf = StratifiedKFold(n_splits=10, shuffle=True, random_state=0)

acc, prec, rec, f1, auc = [], [], [], [], []

for train_idx, test_idx in kf.split(X, y):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]

    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc.append(accuracy_score(y_test, y_pred))
    prec.append(precision_score(y_test, y_pred))
    rec.append(recall_score(y_test, y_pred))
    f1.append(f1_score(y_test, y_pred))
    auc.append(roc_auc_score(y_test, y_prob))

print("=== Evaluation Report (10-Fold CV) ===")
print(f"Accuracy: {np.mean(acc):.4f}")
print(f"Precision: {np.mean(prec):.4f}")
print(f"Recall: {np.mean(rec):.4f}")
print(f"F1-score: {np.mean(f1):.4f}")
print(f"AUC-ROC: {np.mean(auc):.4f}")

# Optionally save report
with open("eval_report.txt", "w") as f:
    f.write("=== Evaluation Report (10-Fold CV) ===\n")
    f.write(f"Accuracy: {np.mean(acc):.4f}\n")
    f.write(f"Precision: {np.mean(prec):.4f}\n")
    f.write(f"Recall: {np.mean(rec):.4f}\n")
    f.write(f"F1-score: {np.mean(f1):.4f}\n")
    f.write(f"AUC-ROC: {np.mean(auc):.4f}\n")
