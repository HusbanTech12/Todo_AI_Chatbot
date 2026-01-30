from fastapi import APIRouter, HTTPException, Depends, Path
from typing import Optional
from pydantic import BaseModel
from sqlmodel import Session, select
import json
from ..models.conversation import Conversation
from ..models.message import Message, MessageCreate
from ..models.task import Task
from ..db.session import get_db_session
from ..auth.middleware import require_authentication, get_current_user_id
from ..agents.todo_agent import run_todo_agent
from ..mcp.tools import MCP_TOOLS

router = APIRouter(prefix="/api/{user_id}", tags=["chat"])

# Request/Response Models
class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list[str]


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    user_id: int,
    request: ChatRequest,
    current_user_id: int = Depends(get_current_user_id)
):
    """
    Process a chat message and return AI response
    Implements the constitutional stateless execution contract
    """
    # Verify user authentication matches the user_id in the path
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Access forbidden: Unauthorized user access")

    # Validate input
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Get database session
    with get_db_session() as session:
        # Step 1: Handle conversation creation/retrieval
        conversation = None

        if request.conversation_id:
            # Retrieve existing conversation
            conversation = session.get(Conversation, request.conversation_id)
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

            # Verify conversation belongs to user
            if conversation.user_id != user_id:
                raise HTTPException(status_code=403, detail="Access forbidden: Unauthorized conversation access")
        else:
            # Create new conversation
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

        # Step 2: Store user message
        user_message = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        session.add(user_message)
        session.commit()

        # Step 3: Fetch conversation history for agent context
        statement = select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at)
        messages = session.exec(statement).all()

        # Format messages for agent
        formatted_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

        # Step 4: Run AI agent with conversation context
        try:
            agent_response = run_todo_agent(formatted_messages, user_id)

            # Extract response and tool calls
            response_text = agent_response.get("response", "I processed your request.")
            tool_calls_executed = agent_response.get("tool_calls", [])

            # Step 5: Store assistant response
            assistant_message = Message(
                user_id=user_id,  # AI acts on behalf of the user
                conversation_id=conversation.id,
                role="assistant",
                content=response_text
            )
            session.add(assistant_message)
            session.commit()

            # Step 6: Return structured response
            return ChatResponse(
                conversation_id=conversation.id,
                response=response_text,
                tool_calls=tool_calls_executed
            )

        except Exception as e:
            # In case of agent error, return a user-friendly message
            session.rollback()
            # Log the error for debugging but return generic message to user
            print(f"Error in chat endpoint: {str(e)}")  # In production, use proper logging
            raise HTTPException(status_code=500, detail="An error occurred while processing your request. Please try again.")