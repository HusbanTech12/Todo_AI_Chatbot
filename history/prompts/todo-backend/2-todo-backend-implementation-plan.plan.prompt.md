---
id: 2
title: todo-backend-implementation-plan
stage: plan
date: 2026-01-31
surface: agent
model: Claude Sonnet 4.5
feature: todo-backend
branch: 005-todo-backend
user: user
command: /sp.plan
labels: ["backend", "plan", "ai-chatbot", "todo", "fastapi"]
links:
  spec: specs/005-todo-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-todo-backend/plan.md
  - specs/005-todo-backend/research.md
  - specs/005-todo-backend/data-model.md
  - specs/005-todo-backend/quickstart.md
  - specs/005-todo-backend/contracts/chat-api.yaml
  - specs/005-todo-backend/contracts/mcp-tools.yaml
tests: []
---

# Todo AI Chatbot Backend Implementation Plan

## User Input
```
# Backend Execution Plan (sp.plan.md)

## Authority

This plan is **governed by `constitution.md`** and must fully comply with:

* `sp.specify.md` (Backend Specification)
* `agent.spec.md`
* `mcp.spec.md`
* `db.schema.md`

This document answers **how** the backend will be implemented, not **what** or **why**.

---

## Backend Mission

Build a **stateless, scalable FastAPI backend** that:

* Orchestrates AI conversations
* Executes OpenAI Agents SDK
* Exposes MCP tools
* Persists all state in PostgreSQL

The backend must remain **restart-safe and horizontally scalable**.

---

## Implementation Phases

### Phase 1: Project Foundation

**Goal:** Establish a clean, constitution-compliant backend skeleton.

Steps:

1. Initialize Python project
2. Install dependencies

   * fastapi
   * uvicorn
   * sqlmodel
   * asyncpg
   * openai-agents-sdk
   * official-mcp-sdk
3. Setup environment variables
4. Configure Neon PostgreSQL connection
5. Setup Better Auth middleware

Deliverable:

* Backend boots successfully
* Health check endpoint works

---

### Phase 2: Database Layer

**Goal:** Implement persistence as defined in `db.schema.md`.

Steps:

1. Define SQLModel models

   * Task
   * Conversation
   * Message
2. Setup DB session management
3. Create migration scripts
4. Validate schema against spec

Rules:

* No business logic in models
* No cascade side-effects

Deliverable:

* Tables created
* CRUD verified via direct DB tests

---

### Phase 3: MCP Server & Tools

**Goal:** Implement stateless task operations via MCP.

Steps:

1. Initialize MCP server
2. Register tools

   * add_task
   * list_tasks
   * complete_task
   * delete_task
   * update_task
3. Implement ownership checks
4. Validate tool inputs & outputs
5. Ensure tools write directly to DB

Rules:

* Tools must be pure
* No cross-tool state
* No agent logic in tools

Deliverable:

* MCP tools callable independently
* DB mutations verified

---

### Phase 4: AI Agent Integration

**Goal:** Connect OpenAI Agents SDK with MCP tools.

Steps:

1. Define Todo Agent using system prompt
2. Register MCP tools with agent runner
3. Validate intent-to-tool mapping
4. Enable multi-tool chaining

Rules:

* Agent never accesses DB
* Agent only uses MCP tools

Deliverable:

* Agent executes correct tools
* Confirmations generated correctly

---

### Phase 5: Chat Orchestration API

**Goal:** Build stateless chat endpoint.

Steps:

1. Implement `POST /api/{user_id}/chat`
2. Authenticate request
3. Fetch conversation history
4. Append user message
5. Execute agent runner
6. Persist assistant message
7. Return response payload

Rules:

* No in-memory session
* Always reconstruct state from DB

Deliverable:

* End-to-end chat works
* Conversations resume after restart

---

### Phase 6: Error Handling & Resilience

**Goal:** Ensure graceful failures.

Steps:

1. Normalize MCP tool errors
2. Handle task-not-found cases
3. Protect agent runner from crashes
4. Return user-friendly errors

Deliverable:

* No uncaught exceptions
* Stable behavior under failures

---

### Phase 7: Observability & Hardening

**Goal:** Production readiness.

Steps:

1. Add structured logging
2. Add request correlation IDs
3. Validate statelessness under load
4. Run concurrency tests

Deliverable:

* Logs are clear
* Server is horizontally scalable

---

## Folder Structure (Final)

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
 ├── auth/middleware.py
 └── main.py
```

---

## Validation Checklist

* [ ] Stateless server confirmed
* [ ] MCP tools mutate DB only
* [ ] Agent never touches DB
* [ ] Conversations persist correctly
* [ ] Multi-tool calls supported
* [ ] Auth enforced everywhere

---

## Explicit Non-Goals

* ❌ WebSockets
* ❌ Long polling
* ❌ Background workers
* ❌ In-memory caching
* ❌ REST task endpoints

---

## Completion Criteria

Backend is complete when:

* Server can restart without data loss
* AI manages tasks via MCP tools
* Frontend can fully operate using chat endpoint
* All constitutional rules remain intact

---

## Status

**Approved – Backend Ready for Implementation**
```

## Response Summary
Successfully created a comprehensive implementation plan for the Todo AI Chatbot Backend. The plan includes:

- Technical context with Python 3.11, FastAPI, OpenAI Agents SDK, SQLModel, and Neon PostgreSQL
- Complete constitutional compliance check with all requirements verified
- Detailed project structure following constitutional architecture guidelines
- Research summary documenting technology decisions
- Complete data model for Task, Conversation, and Message entities
- API contracts for both chat endpoint and MCP tools
- Quickstart guide for development setup

All deliverables from the planning phases have been completed and verified against constitutional requirements.

## Outcome
The implementation plan is complete and ready for the task generation phase (/sp.tasks). All constitutional requirements have been validated, and the technical approach is clearly defined with proper separation of concerns between AI agent, MCP tools, and database layers.

## Files Created/Modified
- specs/005-todo-backend/plan.md: Complete implementation plan
- specs/005-todo-backend/research.md: Technology decisions and best practices
- specs/005-todo-backend/data-model.md: Complete data model specification
- specs/005-todo-backend/quickstart.md: Development setup guide
- specs/005-todo-backend/contracts/chat-api.yaml: Chat API contract
- specs/005-todo-backend/contracts/mcp-tools.yaml: MCP tools contracts