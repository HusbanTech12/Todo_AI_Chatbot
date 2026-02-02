"""
Message model for the Todo AI Chatbot backend
"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class MessageBase(SQLModel):
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str

class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class MessageCreate(MessageBase):
    pass