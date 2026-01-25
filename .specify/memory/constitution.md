<!-- SYNC IMPACT REPORT
Version change: N/A (initial version) → 1.0.0
Modified principles: None (new constitution)
Added sections: All sections (initial constitution)
Removed sections: None
Templates requiring updates: N/A
Follow-up TODOs: None
-->

# Phase III – Todo AI Chatbot Constitution

## Core Principles

### Statelessness First
The backend server MUST NOT store session, conversation, or task state in memory. The AI agent MUST NOT rely on in-process memory. All state (tasks, conversations, messages) MUST be persisted in the database. Every request must be independently executable.

### Database as Single Source of Truth
PostgreSQL (Neon) is the only source of truth. Agents and MCP tools never infer state beyond what is retrieved from the database. Server restarts must not affect correctness or continuity.

### Tool-Only Task Manipulation
AI agents MUST NOT access the database directly. All task operations MUST go through MCP tools. MCP tools are the only layer allowed to mutate task data.

### Clear Separation of Responsibilities
Maintain clear separation of responsibilities across system layers: Frontend (UI and message transport only), FastAPI Chat Endpoint (Orchestration and persistence), OpenAI Agent (Intent recognition and tool selection), MCP Server (Business logic for task operations), Database (Persistent state).

### Technology Constitution
Mandatory technology stack: Frontend (OpenAI ChatKit), Backend (Python FastAPI), AI Framework (OpenAI Agents SDK), MCP Server (Official MCP SDK), ORM (SQLModel), Database (Neon Serverless PostgreSQL), Authentication (Better Auth). No substitutions or parallel stacks are permitted.

### Natural Language Authority
The system MUST correctly understand natural language commands such as "Add a task to buy groceries", "What's pending?", "Mark task 3 as complete", "Delete the meeting task", "Change task 1 to Call mom tonight", "What have I completed?". Natural language is the primary interface, not IDs or forms.

## Data Model Constitution

### Task Model
A `Task` represents a single todo item with required fields: `id`, `user_id`, `title`, `description` (optional), `completed`, `created_at`, `updated_at`.

### Conversation Model
A `Conversation` represents a chat session with required fields: `id`, `user_id`, `created_at`, `updated_at`.

### Message Model
A `Message` represents a single utterance with required fields: `id`, `user_id`, `conversation_id`, `role` (user | assistant), `content`, `created_at`.

## MCP Server Constitution

### MCP Tool Authority
The MCP server is the only authority for task mutation. The following tools MUST exist and MUST NOT change schema: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`.

### MCP Tool Rules
Tools are stateless, tools read/write database state only, tools return structured outputs, not conversational text.

## Agent Constitution

### Agent Role
The AI agent is responsible for understanding user intent, mapping intent to MCP tools, chaining tools when required, and generating friendly confirmations.

### Mandatory Intent Mapping
User intents map to specific tools: Add/Create/Remember → add_task, Show/List → list_tasks, Pending → list_tasks(status="pending"), Completed → list_tasks(status="completed"), Done/Finished → complete_task, Delete/Remove → delete_task, Change/Update → update_task.

### Confirmation Rule
After every successful tool call, the agent must confirm the action in friendly language (e.g., "✅ Task **Buy groceries** has been added").

## Conversation Flow Constitution (Stateless Cycle)
Every request MUST follow this exact sequence: 1. Receive user message, 2. Fetch conversation history from database, 3. Build agent message array (history + new message), 4. Persist user message, 5. Run agent with MCP tools, 6. MCP tools mutate database, 7. Persist assistant response, 8. Return response to client, 9. Discard all in-memory context.

## Error Handling Constitution
Errors must be graceful and human-friendly, no stack traces or internal details may be exposed, missing tasks must result in polite clarification, ambiguous commands must trigger a follow-up question.

## Chat API Constitution
Endpoint: POST /api/{user_id}/chat. Request Rules: `conversation_id` is optional, if missing a new conversation MUST be created, `message` is required and treated as natural language. Response Rules: Must return `conversation_id`, `response` (assistant text), `tool_calls` (list of MCP tools invoked).

## Deliverables Constitution
The repository MUST include: `/frontend` – ChatKit UI, `/backend` – FastAPI + Agents SDK + MCP, `/specs` – Spec-Kit Plus specifications, Database migration scripts, `README.md` with setup instructions.

## Forbidden Actions (Hard Violations)
❌ Storing state in memory
❌ Agents querying database directly
❌ Skipping MCP tools
❌ Modifying MCP tool schemas
❌ Hardcoding responses
❌ Mixing responsibilities across layers

## Final Constitutional Clause
Any implementation that violates this constitution is considered incorrect, even if it appears functional. Correctness is defined by adherence to this constitution, not by output alone.

## Governance

This constitution governs all current and future development of the Phase III Todo AI Chatbot. All agents, services, tools, and contributors MUST adhere to this constitution. Amendments require explicit documentation and approval process. All implementations must verify compliance with constitutional principles.

**Version**: 1.0.0 | **Ratified**: 2026-01-25 | **Last Amended**: 2026-01-25