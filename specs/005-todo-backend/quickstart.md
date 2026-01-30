# Quickstart Guide: Todo AI Chatbot Backend

## Prerequisites

- Python 3.11+
- PostgreSQL (or Neon Serverless PostgreSQL)
- Better Auth credentials
- OpenAI API key
- Official MCP SDK

## Environment Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-name>
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlmodel openai-agents-sdk official-mcp-sdk asyncpg python-multipart
```

4. Set up environment variables:
```bash
# Copy the template
cp .env.example .env

# Edit the .env file with your credentials
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://username:password@localhost/dbname
BETTER_AUTH_SECRET=your_auth_secret
```

## Database Setup

1. Initialize the database:
```bash
# Run the SQLModel migrations
python -c "
from backend.db.session import engine
from backend.models.task import Task
from backend.models.conversation import Conversation
from backend.models.message import Message

Task.metadata.create_all(bind=engine)
Conversation.metadata.create_all(bind=engine)
Message.metadata.create_all(bind=engine)
"
```

2. Verify database connection:
```bash
# Check that tables were created
# The above script should run without errors
```

## Running the Backend

1. Start the MCP server:
```bash
# The MCP tools will be initialized when the main app starts
```

2. Start the FastAPI server:
```bash
uvicorn backend.main:app --reload --port 8000
```

3. Verify the server is running:
```bash
curl http://localhost:8000/health
```

## Testing the API

1. Send a test message:
```bash
curl -X POST http://localhost:8000/api/1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a task to buy groceries"
  }'
```

2. Expected response:
```json
{
  "conversation_id": 1,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

## Key Components

### Models
- `Task`: Handles todo items with title, description, and completion status
- `Conversation`: Manages chat sessions between users and AI
- `Message`: Stores individual messages in conversations

### MCP Tools
- `add_task`: Creates new tasks
- `list_tasks`: Retrieves tasks with optional filtering
- `complete_task`: Marks tasks as completed
- `delete_task`: Removes tasks
- `update_task`: Modifies existing tasks

### Services
- `Chat API`: Orchestrates conversation flow
- `Authentication`: Validates user identity
- `Database Session`: Manages database connections

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for AI agent functionality
- `DATABASE_URL`: Database connection string
- `BETTER_AUTH_SECRET`: Authentication secret
- `DEBUG`: Enable/disable debug mode

### Application Structure
```
/backend
├── api/
│   └── chat.py          # Chat orchestration endpoint
├── agents/
│   └── todo_agent.py    # AI agent definition
├── mcp/
│   └── tools.py         # MCP tools implementation
├── models/
│   ├── task.py          # Task model
│   ├── conversation.py  # Conversation model
│   └── message.py       # Message model
├── db/
│   └── session.py       # Database session management
├── auth/
│   └── middleware.py    # Authentication middleware
└── main.py              # FastAPI application entry point
```

## Development Workflow

1. Create a new branch for your feature
2. Implement your changes following the constitutional requirements
3. Test locally using the example curl commands
4. Run any available tests
5. Submit a pull request with a clear description of changes