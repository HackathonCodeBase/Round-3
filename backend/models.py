from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()


class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(200), nullable=True, default="Anonymous Patient")
    patient_query = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="pending")  # pending / resolved

    responses = relationship("AIResponse", back_populates="query", cascade="all, delete-orphan")


class AIResponse(Base):
    __tablename__ = "ai_responses"

    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("queries.id"), nullable=False)
    ai_suggestion = Column(Text, nullable=True)
    edited_response = Column(Text, nullable=True)
    approved = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    query = relationship("Query", back_populates="responses")
