"""
Conversation model for the Todo AI Chatbot backend
"""
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class ConversationBase(SQLModel):
    user_id: str

class Conversation(ConversationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class ConversationCreate(ConversationBase):
    pass