from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from database import get_db
from model import Book, BookSchema, UserRatings, Tag, BookTag
from auth import get_current_user
from recommender import recommend_for_user, recommend_for_tags

router = APIRouter()

@router.get("/recommendations", response_model=List[BookSchema])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Nie zalogowano")

    user_id = current_user["user_id"]

    tag_rows = db.execute(
        text("SELECT tag_id FROM user_liked_tags WHERE user_id = :uid"),
        {"uid": user_id}
    ).fetchall()
    tag_ids = [t[0] for t in tag_rows] if tag_rows else []

    rated_books = db.query(UserRatings.book_id).filter(UserRatings.user_id == user_id).all()
    rated_ids = {r.book_id for r in rated_books}

    try:
        if rated_ids and user_id in recommend_for_user.__globals__['user_mapping']:
            recommended_ids = recommend_for_user(user_id=user_id, known_item_ids=rated_ids, k=5)
        elif tag_ids:
            recommended_ids = recommend_for_tags(tag_ids, known_item_ids=rated_ids, k=5)
        else:
            recommended_ids = [b.book_id for b in db.query(Book).order_by(Book.average_rating.desc()).limit(5).all()]
    except Exception as e:
        print("Błąd przy generowaniu rekomendacji:", e)
        recommended_ids = []

    books = db.query(Book).filter(Book.book_id.in_(recommended_ids)).all()

    result = []
    for book in books:
        tag = db.query(Tag.name)\
                .join(BookTag, BookTag.tag_id == Tag.id)\
                .filter(BookTag.book_id == book.book_id)\
                .order_by(BookTag.count.desc())\
                .first()
        result.append(
            BookSchema(
                book_id=book.book_id,
                title=book.title,
                authors=book.authors,
                average_rating=book.average_rating,
                small_image_url=book.image_url or book.small_image_url,
                tag=tag[0] if tag else None
            )
        )

    return result
