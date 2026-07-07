import pandas as pd
from collections import defaultdict
from lightfm.data import Dataset
import pickle
import os

DATA_FOLDER = "/mnt/c/Users/gabro/PycharmProjects/JupyterProject/goodbooks-10k"
MODEL_FOLDER = "model"

os.makedirs(MODEL_FOLDER, exist_ok=True)

ratings = pd.read_csv(f"{DATA_FOLDER}/ratings.csv")
books = pd.read_csv(f"{DATA_FOLDER}/books.csv")
book_tags = pd.read_csv(f"{DATA_FOLDER}/book_tags.csv")

print("RAW DATA")
print("ratings:", ratings.shape)
print("books:", books.shape)
print("book_tags:", book_tags.shape)

user_counts = ratings.groupby("user_id").size()
good_users = user_counts[user_counts >= 10].index
ratings = ratings[ratings.user_id.isin(good_users)]

book_counts = ratings.groupby("book_id").size()
good_books = book_counts[book_counts >= 20].index
ratings = ratings[ratings.book_id.isin(good_books)]

ratings["weight"] = ratings["rating"].astype(float)

print("\nAFTER FILTERING")
print("ratings:", ratings.shape)
print("users:", ratings.user_id.nunique())
print("books:", ratings.book_id.nunique())

book_features = defaultdict(dict)

top_tags = (
    book_tags.groupby("tag_id")["count"]
    .sum()
    .sort_values(ascending=False)
    .head(50)
    .index
)

book_tags = book_tags[
    (book_tags.tag_id.isin(top_tags)) &
    (book_tags.goodreads_book_id.isin(good_books))
]

for row in book_tags.itertuples():
    book_features[row.goodreads_book_id][f"tag_{row.tag_id}"] = row.count

for row in books.itertuples():
    if row.book_id in good_books and not pd.isna(row.original_publication_year):
        decade = (int(row.original_publication_year) // 10) * 10
        book_features[row.book_id][f"decade_{decade}"] = 1

for row in books.itertuples():
    if row.book_id in good_books and not pd.isna(row.average_rating):
        book_features[row.book_id]["avg_rating"] = row.average_rating / 5.0

print("\nItem features example:")
print(list(book_features.items())[0])

dataset = Dataset()
dataset.fit(
    users=ratings.user_id.unique(),
    items=ratings.book_id.unique(),
    item_features=list({
        feat for feats in book_features.values() for feat in feats
    })
)

(interactions, weights) = dataset.build_interactions(
    [(r.user_id, r.book_id, r.weight) for r in ratings.itertuples()]
)

item_features_matrix = dataset.build_item_features(
    [(book_id, feats) for book_id, feats in book_features.items()]
)

print("\nMatrices")
print("Interactions:", interactions.shape)
print("Item features:", item_features_matrix.shape)

with open(f"{MODEL_FOLDER}/dataset.pkl", "wb") as f:
    pickle.dump(dataset, f)

with open(f"{MODEL_FOLDER}/item_features.pkl", "wb") as f:
    pickle.dump(item_features_matrix, f)

user_id_map, item_id_map, _, _ = dataset.mapping()

with open(f"{MODEL_FOLDER}/user_id_map.pkl", "wb") as f:
    pickle.dump(user_id_map, f)

with open(f"{MODEL_FOLDER}/item_id_map.pkl", "wb") as f:
    pickle.dump(item_id_map, f)

print("\nZapisano pliki")
