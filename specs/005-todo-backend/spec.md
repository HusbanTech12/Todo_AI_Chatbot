# Todo AI Chatbot Backend Specification

## Purpose

This document defines the **backend functional and non-functional specification** for the **Todo AI Chatbot (Phase III)**.

The backend is the **system of record and execution layer**, responsible for:

* Stateless chat orchestration
* AI agent execution
* MCP tool exposure
* Database persistence

This specification strictly follows:

* `constitution.md`
* `agent.spec.md`
* `mcp.spec.md`
* Spec‑Driven Development principles

---

## Backend Responsibilities

### In Scope

* Expose stateless chat API
* Persist conversations and messages
* Run OpenAI Agents SDK
* Register and expose MCP tools
* Persist task state via MCP tools
* Enforce authentication & authorization
* Handle errors deterministically

### Out of Scope

* UI rendering
* Client-side state
* Direct user task CRUD endpoints
* Long‑lived server memory

---

## Technology Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Web Framework | Python FastAPI             |
| AI Runtime    | OpenAI Agents SDK          |
| MCP Server    | Official MCP SDK           |
| ORM           | SQLModel                   |
| Database      | Neon Serverless PostgreSQL |
| Auth          | Better Auth                |

---

## High‑Level Architecture

```
Frontend (ChatKit)
     │
     ▼
POST /api/{user_id}/chat
     │
     ▼
Chat Orchestrator (FastAPI)
     │
     ▼
OpenAI Agent Runner
     │
     ▼
MCP Server (Tools)
     │
     ▼
PostgreSQL (Neon)
```

---

## API Specification

### Chat Endpoint

**Method**: `POST`
**Path**: `/api/{user_id}/chat`

#### Request Body

```json
{
  "conversation_id": 1,
  "message": "Add a task to buy groceries"
}
```

| Field           | Type    | Required | Description                             |
| --------------- | ------- | -------- | --------------------------------------- |
| conversation_id | integer | No       | Existing conversation or new if omitted |
| message         | string  | Yes      | User input                              |

---

### Response Body

```json
{
  "conversation_id": 1,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

| Field           | Type    | Description            |
| --------------- | ------- | ---------------------- |
| conversation_id | integer | Active conversation ID |
| response        | string  | Assistant response     |
| tool_calls      | array   | MCP tools invoked      |

---

## Stateless Execution Model

The backend **must not store in-memory session state**.

For every request:

1. Fetch conversation history from DB
2. Append new user message
3. Execute agent with full context
4. Persist assistant response
5. Return result

Server must be safe for horizontal scaling.

---

## Conversation Persistence Rules

### Conversation

* Created automatically if no `conversation_id`
* Scoped per `user_id`

### Messages

* Stored for both user and assistant
* Ordered by `created_at`
* Used to reconstruct agent context

---

## MCP Server Specification (Backend View)

* MCP server is embedded or reachable by backend
* Tools are stateless functions
* Tools **must write directly to DB**
* Tools must validate `user_id`

Backend **never mutates tasks directly**.

---

## Tool Invocation Flow

1. Agent selects tool
2. Backend validates parameters
3. MCP tool executes DB operation
4. Tool returns structured output
5. Agent generates confirmation message

---

## Authentication & Authorization

* All endpoints require authentication
* `user_id` must match auth session
* MCP tools enforce ownership

Unauthorized access → `401`

---

## Error Handling Policy

| Error Type     | Behavior                       |
| -------------- | ------------------------------ |
| Task not found | Return friendly error to agent |
| Invalid input  | Agent asks for clarification   |
| DB error       | Generic failure message        |
| Auth error     | Reject request                 |

Backend **never crashes the agent**.

---

## Logging & Observability

* Log each chat request
* Log tool invocations
* Log errors (no PII)

Optional:

* Request ID tracing

---

## Folder Structure (Backend)

```
/backend_site
 ├── app/
 │   └── main.py
 ├── api/
 │   └── chat.py
 ├── agents/
 │   └── todo_agent.py
 ├── mcp/
 │   └── tools.py
 ├── models/
 │   ├── task.py
 │   ├── conversation.py
 │   └── message.py
 ├── db/
 │   └── session.py
 └── requirements.txt
```

---

## Acceptance Criteria

* Backend is stateless
* All tasks managed via MCP tools
* Agent runs only via OpenAI Agents SDK
* Conversations persist across restarts
* Multiple tool calls per turn supported

---

## Explicit Constraints

* ❌ No REST task CRUD endpoints
* ❌ No frontend DB access
* ❌ No in-memory session store
* ❌ No tool logic inside agent

---

## Status

**Final – Backend Specification Approved**