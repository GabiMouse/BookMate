from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from model import Book, UserRatings, RatingCreateSchema
from auth import get_current_user

router = APIRouter()

@router.post("/rate")
def rate_book(rating_data: RatingCreateSchema, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    book = db.query(Book).filter(Book.book_id == rating_data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    existing_rating = db.query(UserRatings).filter_by(
        user_id=current_user["user_id"],
        book_id=rating_data.book_id
    ).first()

    if existing_rating:
        old_rating = existing_rating.rating
        setattr(book, f"ratings_{old_rating}", getattr(book, f"ratings_{old_rating}") - 1)
        existing_rating.rating = rating_data.rating
    else:
        new_rating = UserRatings(
            book_id=rating_data.book_id,
            user_id=current_user["user_id"],
            rating=rating_data.rating
        )
        db.add(new_rating)

    setattr(book, f"ratings_{rating_data.rating}", getattr(book, f"ratings_{rating_data.rating}") + 1)

    db.commit()
    return {"message": "Rating saved"}

@router.get("/my-ratings")
def my_ratings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    ratings = db.query(Book, UserRatings.rating)\
                .join(UserRatings, Book.book_id == UserRatings.book_id)\
                .filter(UserRatings.user_id == current_user["user_id"])\
                .all()
    return [{"book": b[0], "rating": b[1]} for b in ratings]
