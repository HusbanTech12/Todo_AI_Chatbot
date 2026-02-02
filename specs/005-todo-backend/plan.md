# Implementation Plan: Todo AI Chatbot Backend

**Branch**: `005-todo-backend` | **Date**: 2026-02-02 | **Spec**: [specs/005-todo-backend/spec.md](../../specs/005-todo-backend/spec.md)
**Input**: Feature specification from `/specs/005-todo-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a stateless, scalable FastAPI backend that orchestrates AI conversations using OpenAI Agents SDK, exposes MCP tools for task operations, and persists all state in PostgreSQL. The backend follows a strict stateless execution model where every request reconstructs conversation context from the database, executes the AI agent with MCP tools, and persists responses before discarding in-memory data.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: fastapi, uvicorn, sqlmodel, openai-agents-sdk, official-mcp-sdk, asyncpg, better-auth
**Storage**: PostgreSQL (Neon Serverless) accessed via SQLModel ORM
**Testing**: pytest with integration and unit tests
**Target Platform**: Linux server environment (cloud deployment ready)
**Project Type**: Web application backend service
**Performance Goals**: <3 second response time for 90% of requests, support 1000+ concurrent users
**Constraints**: <200ms p95 for database operations, stateless operation (no session storage), secure authentication
**Scale/Scope**: Support 10k+ users with persistent conversations and task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

**Statelessness Compliance**: ✅ Confirmed - Backend must not store session/conversation/task state in memory, all state persisted in database
**Database Authority**: ✅ Confirmed - PostgreSQL (Neon) is single source of truth, all state retrieved from DB
**Tool-Only Task Manipulation**: ✅ Confirmed - AI agents must not access DB directly, all task ops via MCP tools
**Separation of Responsibilities**: ✅ Confirmed - Clear separation: Frontend(UI), FastAPI(orchestration), Agent(intent), MCP(tools), DB(persistence)
**Technology Constitution**: ✅ Confirmed - Using mandated stack: FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Neon PG, Better Auth
**Natural Language Authority**: ✅ Confirmed - System must understand natural commands like "Add task to buy groceries"
**Forbidden Actions Check**: ✅ Confirmed - No memory storage, no direct DB access by agents, no skipping MCP tools

**Post-Design Verification**:
- Data models comply with constitutional requirements (Task, Conversation, Message entities)
- API contracts follow constitutional patterns (chat endpoint structure)
- MCP tool contracts enforce proper separation of concerns
- Stateless execution flow documented and verified

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
backend_site/
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
├── auth/
│   └── middleware.py
├── requirements.txt
└── pyproject.toml
```

**Structure Decision**: Web application backend service with FastAPI as the web framework, following the mandated architecture from the specification. The backend integrates with OpenAI Agents SDK and MCP tools for AI functionality while maintaining statelessness through database persistence.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
