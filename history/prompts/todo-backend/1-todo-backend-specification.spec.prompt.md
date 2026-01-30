---
id: 1
title: todo-backend-specification
stage: spec
date: 2026-01-31
surface: agent
model: Claude Sonnet 4.5
feature: todo-backend
branch: 002-todo-backend
user: user
command: /sp.specify
labels: ["backend", "specification", "ai-chatbot", "todo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-todo-backend/spec.md
  - specs/002-todo-backend/checklists/requirements.md
tests: []
---

# Todo AI Chatbot Backend Specification

## User Input
```
# Backend Specification (sp.specify.md)

## Authority

This specification is **subordinate to `constitution.md`**.
If any conflict exists, **constitution.md overrides this document**.

---

## Purpose

Define the **backend behavior, responsibilities, constraints, and interfaces** for the **Todo AI Chatbot (Phase III)**.

The backend is a **stateless execution engine** that:

* Orchestrates conversations
* Runs AI agents
* Exposes MCP tools
* Persists all state to the database

---

## Constitutional Alignment

This backend **must** comply with the following constitutional laws:

* Stateless server (no memory across requests)
* MCP tools are the *only* way to mutate task data
* AI agents never access database directly
* Backend is the single integration point between Agent, MCP, and DB
* Frontend is a thin client

Violation of any rule is a **system defect**.

---

## Backend Responsibilities

### In Scope

* Expose stateless chat API
* Authenticate and authorize requests
* Retrieve and persist conversation history
* Execute OpenAI Agents SDK runners
* Register MCP tools using Official MCP SDK
* Persist task state through MCP tools
* Return structured responses to frontend

### Out of Scope

* UI logic
* Task CRUD REST APIs
* AI prompt engineering on frontend
* Any long-lived or cached state

---

## Technology Stack (Fixed)

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Web Server  | FastAPI (Python)           |
| AI Runtime  | OpenAI Agents SDK          |
| Tool Server | Official MCP SDK           |
| ORM         | SQLModel                   |
| Database    | Neon Serverless PostgreSQL |
| Auth        | Better Auth                |

Substitutions are **not permitted**.

---

## High-Level Architecture

```
Client (ChatKit)
     │
     ▼
POST /api/{user_id}/chat
     │
     ▼
FastAPI Chat Orchestrator
     │
     ▼
OpenAI Agent Runner
     │
     ▼
MCP Server (Stateless Tools)
     │
     ▼
PostgreSQL (Neon)
```

---

## API Specification

### Chat Endpoint

**Method:** POST
**Route:** `/api/{user_id}/chat`

#### Request Body

```json
{
  "conversation_id": 12,
  "message": "Add a task to buy groceries"
}
```

| Field           | Type    | Required | Description                     |
| --------------- | ------- | -------- | ------------------------------- |
| conversation_id | integer | No       | Existing conversation ID or new |
| message         | string  | Yes      | User input                      |

---

### Response Body

```json
{
  "conversation_id": 12,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

| Field           | Type    | Description            |
| --------------- | ------- | ---------------------- |
| conversation_id | integer | Active conversation ID |
| response        | string  | Assistant message      |
| tool_calls      | array   | MCP tools invoked      |

---

## Stateless Execution Contract

For **every request**, the backend must:

1. Validate authentication and `user_id`
2. Fetch conversation history from database
3. Append new user message
4. Run agent with full context
5. Execute MCP tool calls
6. Persist assistant response
7. Return response
8. Discard all in-memory data

No data survives beyond request scope.

---

## Conversation Persistence Rules

### Conversation

* Created automatically if `conversation_id` absent
* Scoped to a single `user_id`

### Message

* Stored for both user and assistant
* Ordered by `created_at`
* Used to rebuild agent context

---

## MCP Integration Rules

* MCP server is initialized by backend
* Tools are registered once at startup
* Tools are **pure functions + DB writes**
* Tools validate ownership using `user_id`

Backend must never bypass MCP.

---

## Tool Invocation Lifecycle

1. Agent selects MCP tool
2. Backend validates tool schema
3. MCP tool executes database mutation
4. Tool returns structured response
5. Agent generates natural language confirmation

---

## Authentication & Authorization

* All endpoints require valid auth session
* `user_id` must match authenticated user
* MCP tools enforce ownership checks

Failures return HTTP `401` or `403`.

---

## Error Handling Policy

| Scenario       | Backend Behavior             |
| -------------- | ---------------------------- |
| Task not found | Return tool error to agent   |
| Invalid input  | Agent asks for clarification |
| Tool failure   | Graceful failure message     |
| DB outage      | Generic error response       |

Backend must never crash the agent runner.

---

## Logging & Observability

* Log request lifecycle
* Log MCP tool calls
* Log errors without PII

Optional:

* Correlation IDs

---

## Folder Structure (Backend)

```
/backend
 ├── api/chat.py
 ├── agents/todo_agent.py
 ├── mcp/tools.py
 ├── models/
 │   ├── task.py
 │   ├── conversation.py
 │   └── message.py
 ├── db/session.py
 └── main.py
```

---

## Acceptance Criteria

* Backend remains stateless
* Agent never accesses DB directly
* MCP tools handle all task mutations
* Conversations resume after restart
* Multiple tool calls per turn supported

---

## Explicit Prohibitions

* ❌ In-memory session storage
* ❌ REST task CRUD endpoints
* ❌ Direct DB access by agents
* ❌ Frontend-driven task logic

---

## Status

**Approved – Constitution-Compliant Backend Specification**
```

## Response Summary
Successfully created a comprehensive feature specification for the Todo AI Chatbot Backend. The specification includes:

- Detailed user scenarios with prioritized user stories
- Clear functional requirements (FR-001 through FR-010)
- Defined key entities (Conversation, Message, Task)
- Measurable success criteria (SC-001 through SC-007)
- Proper validation with no remaining clarification needs

The specification follows constitutional requirements for stateless operation, MCP tool integration, and proper separation of concerns between AI agent, backend, and database layers.

## Outcome
The specification is complete and ready for the planning phase (/sp.plan). All validation checks passed, and the feature is well-defined with clear acceptance criteria and measurable outcomes.

## Files Created/Modified
- specs/002-todo-backend/spec.md: Complete feature specification
- specs/002-todo-backend/checklists/requirements.md: Quality validation checklist