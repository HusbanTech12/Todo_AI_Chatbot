# Quickstart Guide: Todo AI Chatbot Backend

## Overview
This guide provides the essential steps to set up and run the Todo AI Chatbot Backend.

## Prerequisites
- Python 3.11+
- PostgreSQL (or Neon Serverless account)
- OpenAI API key
- Better Auth credentials (if using hosted version)

## Installation Steps

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <repository-name>
cd backend  # Navigate to backend directory
```

### 2. Set Up Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi uvicorn sqlmodel asyncpg openai-agents-sdk official-mcp-sdk better-auth python-dotenv
```

### 4. Configure Environment Variables
Create a `.env` file in the backend root:
```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost/dbname
OPENAI_API_KEY=your_openai_api_key_here
NEON_DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000  # Adjust for your frontend URL
```

### 5. Database Setup
```bash
# Run migrations (if using alembic)
alembic upgrade head
```

### 6. Run the Application
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Key Components

### API Endpoints
- `POST /api/{user_id}/chat` - Main chat endpoint for conversation

### MCP Tools Available
- `add_task` - Add a new task
- `list_tasks` - List user's tasks
- `complete_task` - Mark a task as complete
- `delete_task` - Delete a task
- `update_task` - Update a task details

### Configuration Files
- `main.py` - Application entry point
- `models/` - Data models (Task, Conversation, Message)
- `api/chat.py` - Chat endpoint implementation
- `agents/todo_agent.py` - AI agent definition
- `mcp/tools.py` - MCP tools implementation
- `db/session.py` - Database session management
- `auth/middleware.py` - Authentication middleware

## Verification Steps
1. Visit `http://localhost:8000/docs` to see the API documentation
2. Send a test request to `/api/test_user/chat` with body: `{"message": "Say hello"}`
3. Verify the response contains appropriate AI-generated content