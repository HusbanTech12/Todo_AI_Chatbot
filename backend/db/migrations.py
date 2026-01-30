"""
Database migration script for Todo AI Chatbot Backend
"""
from sqlmodel import SQLModel
from .session import engine
from ..models.task import Task
from ..models.conversation import Conversation
from ..models.message import Message


def create_db_and_tables():
    """
    Create database tables if they don't exist
    This serves as our migration script for SQLModel
    """
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")


def drop_db_tables():
    """
    Drop all database tables (use with caution!)
    """
    print("Dropping database tables...")
    SQLModel.metadata.drop_all(engine)
    print("Database tables dropped successfully!")


if __name__ == "__main__":
    create_db_and_tables()