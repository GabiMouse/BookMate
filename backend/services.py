from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from model import Book, BookSchema


def get_books_with_tags(db: Session, limit: int = 100):
    books = db.query(Book).options(joinedload(Book.tag)).limit(limit).all()
    books_dto = [
        BookSchema(
            book_id=book.book_id,
            title=book.title,
            authors=book.authors,
            average_rating=book.average_rating,
            small_image_url=book.image_url,
            tag=book.tag.tag_name if book.tag else None
        )
        for book in books
    ]
    return books_dto

def get_book_with_tag(db: Session, book_id: int):
    book = db.query(Book).options(joinedload(Book.tag)).filter(Book.book_id == book_id).first()
    if book:
        return BookSchema(
            book_id=book.book_id,
            title=book.title,
            authors=book.authors,
            average_rating=book.average_rating,
            small_image_url=book.image_url,
            tag=book.tag.tag_name if book.tag else None
        )
    return None
