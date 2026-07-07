from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, constr, HttpUrl
from sqlalchemy.orm import relationship
from typing import Optional



class BookSchema(BaseModel):
    book_id: int
    title: str
    authors: str
    average_rating: float
    small_image_url: str
    tag: Optional[str]

    class Config:
        orm_mode = True

Base = declarative_base()

class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    authors = Column(String)
    isbn = Column(String)
    original_publication_year = Column(Integer)
    image_url = Column(Text)
    small_image_url = Column(Text)
    average_rating = Column(Float)
    ratings_1 = Column(Integer)
    ratings_2 = Column(Integer)
    ratings_3 = Column(Integer)
    ratings_4 = Column(Integer)
    ratings_5 = Column(Integer)

    tags = relationship("BookTag", back_populates="book")

    user_ratings = relationship("UserRatings", back_populates="book")


class BookTag(Base):
    __tablename__ = "books_tags"

    book_id = Column(Integer, ForeignKey("books.book_id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
    count = Column(Integer, default=1)

    book = relationship("Book", back_populates="tags")
    tag = relationship("Tag")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)


class BookCreateSchema(BaseModel):
    title: constr(min_length=1)
    authors: constr(min_length=1)
    original_publication_year: int
    isbn: constr(min_length=10)
    tag_id: int
    image_url: Optional[HttpUrl] = None
    small_image_url: Optional[HttpUrl] = None

    class Config:
        orm_mode = True

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

class RatingCreateSchema(BaseModel):
    book_id: int
    rating: int

class UserRatings(Base):
    __tablename__ = "user_ratings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.book_id"), nullable=False)
    rating = Column(Integer, nullable=False)

    book = relationship("Book", back_populates="user_ratings")
