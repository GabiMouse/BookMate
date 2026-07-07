from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func

from database import get_db
from sqlalchemy.orm import Session
from auth import get_current_user
from model import Book, UserRatings

router = APIRouter()

@router.delete("/rate/{book_id}")
def delete_rating(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    rating = db.query(UserRatings).filter(
        UserRatings.user_id == user_id,
        UserRatings.book_id == book_id
    ).first()

    if not rating:
        raise HTTPException(status_code=404, detail="Brak oceny do usunięcia")

    db.delete(rating)
    db.commit()

    avg = db.query(func.avg(UserRatings.rating))\
            .filter(UserRatings.book_id == book_id)\
            .scalar()

    book = db.query(Book).filter(Book.book_id == book_id).first()
    book.average_rating = round(avg, 2) if avg else 0
    db.commit()

    return {
        "message": "Ocena usunięta",
        "average_rating": book.average_rating
    }
