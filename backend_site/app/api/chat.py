"""
Chat API endpoint for the Todo AI Chatbot backend
"""
from fastapi import APIRouter
from typing import Optional, Dict, List, Any
from pydantic import BaseModel
import json
import time

router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[str]

# In-memory storage for demo purposes
# In a real implementation, this would use the database
conversations_storage: Dict[int, Dict[str, Any]] = {}
messages_storage: Dict[int, List[Dict[str, Any]]] = {}
next_conversation_id = 1
next_message_id = 1

@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    request: ChatRequest
):
    """
    Chat endpoint that handles user messages and returns AI responses
    Following the constitutional stateless execution model:
    1. Validate authentication and user_id
    2. Fetch conversation history from database
    3. Append new user message
    4. Run agent with full context
    5. Persist assistant response
    6. Return response
    """
    global next_conversation_id, next_message_id

    # Step 1: Validate user_id (in a real implementation, this would come from auth)
    # For now, we'll accept any user_id as valid

    # Step 2: Get or create conversation
    conversation_id = request.conversation_id
    if not conversation_id:
        # Create new conversation
        conversation_id = next_conversation_id
        next_conversation_id += 1
        conversations_storage[conversation_id] = {
            "id": conversation_id,
            "user_id": user_id,
            "created_at": time.time()
        }
        messages_storage[conversation_id] = []
    elif conversation_id not in conversations_storage:
        # If conversation doesn't exist, create it
        conversations_storage[conversation_id] = {
            "id": conversation_id,
            "user_id": user_id,
            "created_at": time.time()
        }
        messages_storage[conversation_id] = []

    # Step 3: Save user message to in-memory storage
    user_message = {
        "id": next_message_id,
        "user_id": user_id,
        "conversation_id": conversation_id,
        "role": "user",
        "content": request.message,
        "timestamp": time.time()
    }
    next_message_id += 1
    messages_storage[conversation_id].append(user_message)

    # Step 4: In a real implementation, we would run the AI agent here
    # For now, we'll implement a simple rule-based response for demo purposes
    # that recognizes certain commands and responds appropriately

    lower_msg = request.message.lower()
    response_text = ""
    tool_calls = []

    if "add" in lower_msg or "create" in lower_msg or "buy" in lower_msg or "task" in lower_msg:
        # Recognize task creation request
        # In a real implementation, this would call the AI agent which would call MCP tools
        response_text = f"✅ Task added: {request.message.replace('add ', '').replace('create ', '').replace('buy ', '')}"
        tool_calls = ["add_task"]
    elif "hello" in lower_msg or "hi" in lower_msg:
        response_text = "Hello! I'm your AI assistant. You can ask me to manage your tasks."
    elif "help" in lower_msg:
        response_text = "I can help you manage your tasks. Try saying 'add a task to buy groceries' or 'show my tasks'."
    elif "complete" in lower_msg or "done" in lower_msg:
        response_text = "Task marked as complete. What else would you like to do?"
        tool_calls = ["complete_task"]
    elif "delete" in lower_msg or "remove" in lower_msg:
        response_text = "Task deleted successfully."
        tool_calls = ["delete_task"]
    else:
        response_text = f"I received your message: '{request.message}'. In a full implementation, this would be processed by an AI agent."

    # Step 5: Save assistant response to in-memory storage
    assistant_message = {
        "id": next_message_id,
        "user_id": user_id,
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": response_text,
        "timestamp": time.time()
    }
    next_message_id += 1
    messages_storage[conversation_id].append(assistant_message)

    # Step 6: Return structured response
    return ChatResponse(
        conversation_id=conversation_id,
        response=response_text,
        tool_calls=tool_calls
    )