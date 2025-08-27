from wordcloud import WordCloud
import matplotlib.pyplot as plt
import pandas as pd

# Load your processed dataset
df = pd.read_csv(
    "../data/processed/full_goemotions_1.csv"
)  # or use df directly if in same script

# Join all clean text into one string
text_data = " ".join(df["clean_text"].astype(str))

# Generate WordCloud
wordcloud = WordCloud(
    width=800, height=400, background_color="white", colormap="viridis"
).generate(text_data)

# Save image inside data/processed
output_path = "../data/processed/wordcloud.png"
wordcloud.to_file(output_path)

# Also show for review
plt.figure(figsize=(12, 6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
plt.title("Word Cloud of Cleaned Text Data", fontsize=16)
plt.show()
