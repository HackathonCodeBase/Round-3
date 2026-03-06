from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from database import get_db
from models import Query, AIResponse
from gemini_service import generate_response

router = APIRouter()


# ── Pydantic Schemas ──────────────────────────────────────────────

class QueryCreate(BaseModel):
    patient_query: str
    patient_name: Optional[str] = "Anonymous Patient"


class GenerateRequest(BaseModel):
    query_id: int


class SendResponse(BaseModel):
    query_id: int
    edited_response: str


class QueryResponse(BaseModel):
    id: int
    patient_name: str
    patient_query: str
    created_at: datetime
    status: str

    class Config:
        from_attributes = True


class AIResponseSchema(BaseModel):
    id: int
    query_id: int
    ai_suggestion: Optional[str]
    edited_response: Optional[str]
    approved: bool
    timestamp: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    id: int
    patient_name: str
    patient_query: str
    created_at: datetime
    status: str
    ai_suggestion: Optional[str]
    edited_response: Optional[str]
    approved_at: Optional[datetime]


# ── Endpoints ─────────────────────────────────────────────────────

@router.post("/query", response_model=QueryResponse)
def submit_query(data: QueryCreate, db: Session = Depends(get_db)):
    """Accept a patient query and store it in the database."""
    query = Query(
        patient_name=data.patient_name or "Anonymous Patient",
        patient_query=data.patient_query,
        status="pending"
    )
    db.add(query)
    db.commit()
    db.refresh(query)
    return query


@router.post("/generate-response")
def generate_ai_response(data: GenerateRequest, db: Session = Depends(get_db)):
    """Send query to Gemini and return AI-suggested response."""
    query = db.query(Query).filter(Query.id == data.query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    try:
        ai_text = generate_response(query.patient_query)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Update or create AI response record
    ai_response = db.query(AIResponse).filter(AIResponse.query_id == data.query_id).first()
    if ai_response:
        ai_response.ai_suggestion = ai_text
        ai_response.timestamp = datetime.utcnow()
    else:
        ai_response = AIResponse(
            query_id=data.query_id,
            ai_suggestion=ai_text,
            approved=False
        )
        db.add(ai_response)

    db.commit()
    db.refresh(ai_response)

    return {
        "query_id": data.query_id,
        "ai_suggestion": ai_text,
        "response_id": ai_response.id
    }


@router.post("/send-response")
def send_response(data: SendResponse, db: Session = Depends(get_db)):
    """Save the edited response and mark query as resolved."""
    query = db.query(Query).filter(Query.id == data.query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")

    ai_response = db.query(AIResponse).filter(AIResponse.query_id == data.query_id).first()
    if not ai_response:
        # Create a response record even if no AI suggestion was generated
        ai_response = AIResponse(
            query_id=data.query_id,
            ai_suggestion=None,
            approved=True
        )
        db.add(ai_response)

    ai_response.edited_response = data.edited_response
    ai_response.approved = True
    ai_response.timestamp = datetime.utcnow()

    query.status = "resolved"

    db.commit()

    return {"message": "Response approved and sent successfully", "query_id": data.query_id}


@router.get("/queries", response_model=List[QueryResponse])
def get_all_queries(db: Session = Depends(get_db)):
    """Fetch all queries ordered by most recent first."""
    queries = db.query(Query).order_by(Query.created_at.desc()).all()
    return queries


@router.get("/history", response_model=List[HistoryItem])
def get_history(db: Session = Depends(get_db)):
    """Fetch resolved queries with their AI and edited responses."""
    resolved = db.query(Query).filter(Query.status == "resolved").order_by(Query.created_at.desc()).all()
    history = []
    for q in resolved:
        ai_resp = db.query(AIResponse).filter(AIResponse.query_id == q.id).first()
        history.append(HistoryItem(
            id=q.id,
            patient_name=q.patient_name,
            patient_query=q.patient_query,
            created_at=q.created_at,
            status=q.status,
            ai_suggestion=ai_resp.ai_suggestion if ai_resp else None,
            edited_response=ai_resp.edited_response if ai_resp else None,
            approved_at=ai_resp.timestamp if ai_resp else None,
        ))
    return history


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Dashboard stats."""
    total = db.query(Query).count()
    pending = db.query(Query).filter(Query.status == "pending").count()
    resolved = db.query(Query).filter(Query.status == "resolved").count()
    ai_generated = db.query(AIResponse).filter(AIResponse.ai_suggestion.isnot(None)).count()
    return {
        "total_queries": total,
        "pending": pending,
        "resolved": resolved,
        "ai_suggestions_generated": ai_generated
    }
