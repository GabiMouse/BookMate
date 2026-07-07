from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, String
from database import get_db
from model import Book

router = APIRouter()

@router.get("/books/search")
def search_books(query: str = Query("", min_length=0), db: Session = Depends(get_db)):
    try:
        if not query:
            return []

        results = (
            db.query(Book)
            .filter(
                or_(
                    Book.title.ilike(f"%{query}%"),
                    Book.authors.ilike(f"%{query}%"),
                    Book.book_id.cast(String).ilike(f"%{query}%")
                )
            )
            .all()
        )
        return results

    except Exception as e:
        print("BŁĄD W SEARCH:", e)
        raise HTTPException(status_code=500, detail="Błąd serwera przy wyszukiwaniu")
