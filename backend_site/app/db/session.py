"""
Database session management for the Todo AI Chatbot backend
"""
from sqlmodel import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session() -> Generator:
    """
    Get database session
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()