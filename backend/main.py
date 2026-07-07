import uvicorn
from fastapi import FastAPI
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from model import Book, BookTag, UserRatings, Tag
from fastapi.middleware.cors import CORSMiddleware
from add_books import router as add_router
from fastapi import Depends, Query
import auth
from auth import router as auth_router
from booksearch import router as search_router
from rating import router as rate_router
from sqlalchemy.orm import joinedload
from recommendation_api import router as recommendation_router
from user_preference import router as preferences_router
from book_tags import router as tags_router
from delete_book import router as delete_router


app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(search_router)
app.include_router(add_router)
app.include_router(rate_router)
app.include_router(preferences_router, tags=["preferences"])
app.include_router(tags_router)
app.include_router(recommendation_router)
app.include_router(delete_router)

@app.get("/")
def root():
    return {"message": "Backend działa!"}

@app.get("/books")
def get_books(
    genre: str = Query(None),
    min_rating: float = Query(0),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Book)
        .outerjoin(Book.tags)
        .outerjoin(BookTag.tag)
    )

    if genre:
        query = query.filter(Tag.name == genre)


    if min_rating > 0:
        query = query.filter(Book.average_rating >= min_rating)

    books = query.offset(skip).limit(limit).all()

    result = []
    for b in books:
        result.append({
            **b.__dict__,
            "tag": b.tags[0].tag.name if b.tags else None

        })

    return result


@app.get("/genres")
def get_genres(db: Session = Depends(get_db)):
    genres = db.query(BookTag.tag_name).distinct().all()
    return [g[0] for g in genres]


@app.get("/books/{book_id}")
def get_book(book_id: int,
             db: Session = Depends(get_db),
             current_user: Optional[dict] = Depends(auth.get_current_user_optional)):

    book = (
        db.query(Book)
        .options(joinedload(Book.tags).joinedload(BookTag.tag))
        .filter(Book.book_id == book_id)
        .first()
    )

    if not book:
        return {"error": "Book not found"}

    user_rating = 0
    if current_user:
        rating_obj = db.query(UserRatings.rating).filter_by(
            book_id=book_id, user_id=current_user["user_id"]
        ).first()
        user_rating = rating_obj[0] if rating_obj else 0

    return {
        **book.__dict__,
        "tag": book.tags[0].tag.name if book.tags else None,
        "user_rating": user_rating
    }



if __name__ == "__main__":
    uvicorn.run(app, port=8080)
