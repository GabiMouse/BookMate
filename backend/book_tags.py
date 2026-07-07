from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from model import Tag

router = APIRouter()

@router.get("/tags")
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return [{"id": t.id, "name": t.name} for t in tags]
