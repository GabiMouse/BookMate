from recommender import recommend_for_user
from recommender import user_mapping

print("Przykładowi użytkownicy w modelu:")
print(list(user_mapping.keys())[:10])

test_user_id = list(user_mapping.keys())[2]

known_item_ids = set()

recs = recommend_for_user(
    user_id=test_user_id,
    known_item_ids=known_item_ids,
    k=5
)

print(f"Rekomendacje dla user_id={test_user_id}:")
print(recs)

#input("Naciśnij Enter")