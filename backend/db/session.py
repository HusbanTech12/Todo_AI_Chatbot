from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlmodel import Session
from contextlib import contextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_chatbot.db")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)


def get_session() -> Session:
    """Get a database session"""
    with Session(engine) as session:
        yield session


@contextmanager
def get_db_session():
    """Context manager for database sessions"""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Global session getter for convenience
def get_session_context():
    """Provides a session context for use in endpoints"""
    return Session(engine)


def create_db_and_tables():
    """Create database tables if they don't exist"""
    from ..models.task import Task
    from ..models.conversation import Conversation
    from ..models.message import Message

    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)