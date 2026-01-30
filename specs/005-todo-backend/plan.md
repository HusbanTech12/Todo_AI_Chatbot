# Implementation Plan: Todo AI Chatbot Backend

**Branch**: `005-todo-backend` | **Date**: 2026-01-31 | **Spec**: [specs/005-todo-backend/spec.md](specs/005-todo-backend/spec.md)
**Input**: Feature specification from `/specs/005-todo-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a stateless FastAPI backend that orchestrates AI conversations with the OpenAI Agents SDK, integrates MCP tools for all database operations, and persists all state in PostgreSQL. The backend must follow constitutional requirements for statelessness and proper separation of responsibilities between layers.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, Official MCP SDK, SQLModel, Neon Serverless PostgreSQL, Better Auth
**Storage**: Neon Serverless PostgreSQL database with SQLModel ORM
**Testing**: pytest for backend testing, contract testing for MCP tool interfaces
**Target Platform**: Linux server (cloud deployment)
**Project Type**: web - backend service for AI chatbot
**Performance Goals**: <3 second response time for 90% of requests, support 1000 concurrent users
**Constraints**: Must maintain stateless operation (no in-memory session storage), all state must be in database, MCP tools must be the only way to mutate task data
**Scale/Scope**: Support thousands of users with persistent conversations, horizontally scalable architecture

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Statelessness Compliance
- ✓ Backend must NOT store session/conversation/task state in memory
- ✓ AI agent must NOT rely on in-process memory
- ✓ All state must be persisted in database
- ✓ Every request must be independently executable

### Database Authority Compliance
- ✓ PostgreSQL (Neon) is the only source of truth
- ✓ Agents never infer state beyond what's retrieved from database
- ✓ Server restarts must not affect correctness or continuity

### Tool-Only Task Manipulation Compliance
- ✓ AI agents must NOT access database directly
- ✓ All task operations must go through MCP tools
- ✓ MCP tools are the only layer allowed to mutate task data

### Responsibility Separation Compliance
- ✓ Frontend: UI and message transport only
- ✓ FastAPI Chat Endpoint: Orchestration and persistence
- ✓ OpenAI Agent: Intent recognition and tool selection
- ✓ MCP Server: Business logic for task operations
- ✓ Database: Persistent state

### Technology Stack Compliance
- ✓ Backend: Python FastAPI
- ✓ AI Framework: OpenAI Agents SDK
- ✓ MCP Server: Official MCP SDK
- ✓ ORM: SQLModel
- ✓ Database: Neon Serverless PostgreSQL
- ✓ Authentication: Better Auth
- ✓ No substitutions permitted

### Natural Language Authority Compliance
- ✓ System must understand natural language commands
- ✓ Natural language is the primary interface, not IDs or forms

### MCP Tool Authority Compliance
- ✓ MCP server is the only authority for task mutation
- ✓ Required tools exist: add_task, list_tasks, complete_task, delete_task, update_task
- ✓ MCP tool schemas must not change

### Conversation Flow Compliance
- ✓ Every request follows stateless cycle: receive → fetch history → build agent context → persist user message → run agent → MCP tools mutate DB → persist assistant response → return response → discard memory

## Project Structure

### Documentation (this feature)

```text
specs/005-todo-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
/backend
├── api/
│   └── chat.py          # Chat orchestration endpoint
├── agents/
│   └── todo_agent.py    # AI agent definition and configuration
├── mcp/
│   └── tools.py         # MCP tools implementation
├── models/
│   ├── task.py          # Task model
│   ├── conversation.py  # Conversation model
│   └── message.py       # Message model
├── db/
│   └── session.py       # Database session management
├── auth/
│   └── middleware.py    # Better Auth integration
└── main.py              # FastAPI application entry point
```

**Structure Decision**: Web application backend structure selected based on feature requirements for FastAPI backend with AI agent integration, MCP tools, and PostgreSQL database.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
