from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from schemas import UserPreferencesSchema

router = APIRouter()

@router.get("/users/preferences/status")
def preferences_status(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user:
        raise HTTPException(status_code=401, detail="Nie zalogowano")

    count = db.execute(
        text("SELECT COUNT(*) FROM user_liked_tags WHERE user_id = :uid"),
        {"uid": user["user_id"]}
    ).scalar()

    return {"has_preferences": count == 3}


@router.post("/users/preferences")
def save_preferences(
    data: UserPreferencesSchema,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user:
        raise HTTPException(status_code=401, detail="Nie zalogowano")

    tag_ids = data.tag_ids

    if len(tag_ids) != 3:
        raise HTTPException(400, "Wybierz 3 gatunki")

    try:
        # usuń stare preferencje
        db.execute(
            text("DELETE FROM user_liked_tags WHERE user_id = :uid"),
            {"uid": user["user_id"]}
        )

        # dodaj nowe
        for tag_id in tag_ids:
            db.execute(
                text("""
                INSERT INTO user_liked_tags (user_id, tag_id)
                VALUES (:uid, :tid)
                """),
                {"uid": user["user_id"], "tid": tag_id}
            )

        db.commit()
        return {"status": "ok"}

    except Exception as e:
        db.rollback()
        raise HTTPException(500, str(e))
