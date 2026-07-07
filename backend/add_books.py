from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from model import Book, BookTag, BookCreateSchema

router = APIRouter()


@router.post("/add")
def create_book(book_data: BookCreateSchema, db: Session = Depends(get_db)):
    try:
        new_book = Book(
            title=book_data.title,
            authors=book_data.authors,
            original_publication_year=book_data.original_publication_year,
            isbn=book_data.isbn,
            image_url=str(book_data.image_url) if book_data.image_url else "",
            small_image_url=str(book_data.small_image_url) if book_data.small_image_url else "",
            average_rating=0,
            ratings_1=0,
            ratings_2=0,
            ratings_3=0,
            ratings_4=0,
            ratings_5=0
        )
        db.add(new_book)
        db.commit()
        db.refresh(new_book)

        new_tag = BookTag(
            book_id=new_book.book_id,
            tag_name=book_data.tag_name
        )
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)

        return {
            "book_id": new_book.book_id,
            "title": new_book.title,
            "authors": new_book.authors,
            "original_publication_year": new_book.original_publication_year,
            "isbn": new_book.isbn,
            "image_url": new_book.image_url,
            "small_image_url": new_book.small_image_url,
            "tag": new_tag.tag_name
        }
    except Exception as e:
        print("Błąd podczas dodawania książki:", e)
        raise HTTPException(status_code=500, detail=str(e))

