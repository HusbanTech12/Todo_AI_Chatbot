# Implementation Plan: Todo AI Chatbot Backend

**Branch**: `001-todo-backend` | **Date**: 2026-01-30 | **Spec**: [link to spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a stateless FastAPI backend that orchestrates AI conversations with the OpenAI Agents SDK, integrates with MCP tools for task operations, and persists all state in PostgreSQL. The backend follows constitutional principles of statelessness and tool-only task manipulation.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, openai-agents-sdk, official-mcp-sdk, better-auth
**Storage**: PostgreSQL (Neon Serverless)
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: web (backend service)
**Performance Goals**: <5s response time for chat requests, 99% conversation continuity
**Constraints**: Must be stateless, no in-memory session storage, all state in DB
**Scale/Scope**: Support multiple concurrent users, horizontally scalable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Compliance Verification:
- ✅ **Statelessness First**: Backend will not store session/conversation/task state in memory
- ✅ **Database as Single Source of Truth**: All state persisted in PostgreSQL
- ✅ **Tool-Only Task Manipulation**: AI agents will only use MCP tools for task operations
- ✅ **Clear Separation of Responsibilities**: Proper layer separation (Frontend/Backend/Agent/MCP/DB)
- ✅ **Technology Constitution**: Using mandated stack (Python FastAPI, SQLModel, Neon, Better Auth)
- ✅ **Natural Language Authority**: System designed to handle natural language commands
- ✅ **Forbidden Actions Avoided**: No memory storage, no direct DB access by agents, no skipping MCP tools

### Post-Design Constitutional Verification:
- ✅ **Data Model Compliance**: Task, Conversation, Message entities match constitutional requirements
- ✅ **API Contract Compliance**: Chat endpoint follows constitutional specification
- ✅ **MCP Tool Compliance**: All five required tools (add_task, list_tasks, complete_task, delete_task, update_task) specified
- ✅ **Authentication Compliance**: Better Auth integration enforces user ownership
- ✅ **Statelessness Compliance**: Design enforces no in-memory session storage

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-backend/
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
├── api/chat.py              # Chat orchestration endpoint
├── agents/todo_agent.py     # AI agent definition and runner
├── mcp/tools.py             # MCP tools implementation
├── models/
│   ├── task.py             # Task entity model
│   ├── conversation.py     # Conversation entity model
│   └── message.py          # Message entity model
├── db/session.py           # Database session management
├── auth/middleware.py      # Better Auth integration
└── main.py                 # Application entry point
```

**Structure Decision**: Web application structure with dedicated backend service following the constitutional requirements and specified folder structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | All constitutional requirements satisfied |
