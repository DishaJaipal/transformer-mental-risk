import pandas as pd

df1 = pd.read_csv(r"../data/raw/goemotions_1.csv")
df2 = pd.read_csv(r"../data/raw/goemotions_2.csv")
df3 = pd.read_csv(r"../data/raw/goemotions_3.csv")

df = pd.concat([df1, df2, df3], ignore_index=True)
df = df.drop_duplicates(subset=['text'], keep='first')
df = df.reset_index(drop=True)
df.to_csv(r"../data/full_goemotions.csv", index=False)
print(df.shape)