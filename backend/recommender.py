import pickle
import numpy as np
from scipy.sparse import csr_matrix


with open("../recommender/model/model_best.pkl", "rb") as f:
    model = pickle.load(f)

with open("../recommender/model/dataset.pkl", "rb") as f:
    dataset = pickle.load(f)

with open("../recommender/model/item_features.pkl", "rb") as f:
    item_features = pickle.load(f)

user_mapping, user_feature_mapping, item_mapping, item_feature_mapping = dataset.mapping()
internal_to_item = {v: k for k, v in item_mapping.items()}  # model index -> book_id
all_item_internal_ids = np.array(list(item_mapping.values()))

NUM_ITEMS = len(all_item_internal_ids)
NUM_USER_FEATURES = len(user_feature_mapping)
tag_id_map = user_feature_mapping

def build_user_features_from_tags(tag_ids):
    """
    tag_ids: lista ID tagów użytkownika
    Zwraca macierz cech użytkownika dla modelu LightFM
    """
    row = []
    col = []
    data = []

    for tag_id in tag_ids:
        if tag_id in tag_id_map:
            row.append(0)
            col.append(tag_id_map[tag_id])
            data.append(1.0)

    return csr_matrix(
        (data, (row, col)),
        shape=(1, NUM_USER_FEATURES)
    )

def recommend_for_tags(tag_ids, known_item_ids=None, k=5):
    if not tag_ids:
        return []

    user_features = build_user_features_from_tags(tag_ids)
    scores = model.predict(
        user_ids=0,
        item_ids=np.arange(NUM_ITEMS),
        user_features=user_features,
        item_features=item_features
    )

    ranked = np.argsort(-scores)
    recommendations = []

    for idx in ranked:
        book_id = internal_to_item[idx]
        if known_item_ids and book_id in known_item_ids:
            continue
        recommendations.append(int(book_id))  # <- konwersja
        if len(recommendations) >= k:
            break

    return recommendations


def recommend_for_user(user_id: int, known_item_ids=None, k=5):
    if user_id not in user_mapping:
        raise ValueError("Użytkownik nie jest w modelu")

    user_index = user_mapping[user_id]
    scores = model.predict(
        user_index,
        np.arange(NUM_ITEMS),
        item_features=item_features
    )

    ranked = np.argsort(-scores)
    recommendations = []

    for idx in ranked:
        book_id = internal_to_item[idx]
        if known_item_ids and book_id in known_item_ids:
            continue
        recommendations.append(int(book_id))
        if len(recommendations) >= k:
            break

    return recommendations


def get_recommendations(user_id=None, tag_ids=None, known_item_ids=None, k=5):
    """
    user_id: jeśli użytkownik ma oceny w modelu
    tag_ids: jeśli użytkownik nie ma ocen (cold start)
    known_item_ids: do pominięcia już ocenionych książek
    """
    if user_id and user_id in user_mapping:
        return recommend_for_user(user_id, known_item_ids=known_item_ids, k=k)
    elif tag_ids:
        return recommend_for_tags(tag_ids, known_item_ids=known_item_ids, k=k)
    else:
        return list(np.random.choice(list(internal_to_item.values()), size=k, replace=False))
