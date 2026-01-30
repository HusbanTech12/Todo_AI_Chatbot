# Feature Specification: Todo AI Chatbot Backend

**Feature Branch**: `005-todo-backend`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "# Backend Specification (sp.specify.md)

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

**Approved – Constitution-Compliant Backend Specification**"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start and Continue AI-Powered Todo Conversations (Priority: P1)

As a user, I want to interact with an AI-powered chatbot to manage my todos through natural language conversations, so that I can efficiently add, update, and manage my tasks without navigating complex interfaces.

**Why this priority**: This is the core value proposition of the feature - enabling users to manage their todos through natural language interactions with an AI assistant.

**Independent Test**: Can be fully tested by sending a message to the chat endpoint and verifying that the AI understands the request and performs the appropriate todo management action, delivering immediate value for basic todo operations.

**Acceptance Scenarios**:

1. **Given** user is authenticated and has a valid session, **When** user sends message "Add a task to buy groceries", **Then** the AI assistant responds with confirmation and the task is persisted in the database
2. **Given** user has existing conversation context, **When** user sends follow-up message "Set deadline for grocery task to tomorrow", **Then** the AI assistant understands the reference and updates the existing task appropriately

---

### User Story 2 - Maintain Conversation State Across Sessions (Priority: P2)

As a user, I want my conversation with the AI assistant to maintain context even after closing and reopening the application, so that I can continue my todo management conversation seamlessly.

**Why this priority**: Critical for user experience as losing conversation context would make the AI feel disconnected and reduce effectiveness.

**Independent Test**: Can be tested by creating a conversation, performing several exchanges, then simulating a session restart and continuing the conversation with context-aware responses.

**Acceptance Scenarios**:

1. **Given** user has an ongoing conversation with multiple messages, **When** conversation history is retrieved, **Then** the complete history is available to reconstruct the AI context
2. **Given** user reconnects to a previous conversation, **When** user sends a contextual message referring to previous exchanges, **Then** the AI correctly interprets the reference based on historical context

---

### User Story 3 - Secure Access to Personal Todo Data (Priority: P1)

As a user, I want my todo data to be securely isolated from other users' data, so that I can trust the system with my personal information and tasks.

**Why this priority**: Security and privacy are fundamental requirements that must be built into the system from the start.

**Independent Test**: Can be tested by verifying that user A cannot access user B's conversations or tasks, and that authentication is properly validated on every request.

**Acceptance Scenarios**:

1. **Given** authenticated user requests their conversations, **When** backend validates user identity, **Then** only conversations belonging to that user are returned
2. **Given** unauthenticated or invalid user attempts access, **When** authentication check occurs, **Then** appropriate error response is returned without exposing data

---

### User Story 4 - Execute AI-Driven Actions Through MCP Tools (Priority: P2)

As a user, I want the AI assistant to be able to perform actions like creating, updating, and deleting tasks, so that my natural language requests result in actual changes to my todo list.

**Why this priority**: This connects the AI understanding layer to the actual data manipulation, which is essential for the feature to provide real value.

**Independent Test**: Can be tested by sending commands to the AI that should trigger data changes and verifying that MCP tools execute the appropriate database operations.

**Acceptance Scenarios**:

1. **Given** user requests to add a task, **When** AI selects the appropriate MCP tool, **Then** the task is persisted in the database through the tool
2. **Given** user requests to mark a task as complete, **When** AI invokes the update task tool, **Then** the task status is changed in the database

---

### Edge Cases

- What happens when the AI agent fails to process a request due to service unavailability?
- How does the system handle malformed or extremely long user input messages?
- What occurs when database operations fail during a conversation flow?
- How does the system handle concurrent requests from the same user?
- What happens when the conversation context becomes too large to process efficiently?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a stateless chat API endpoint at `/api/{user_id}/chat` that accepts user messages and returns AI responses
- **FR-002**: System MUST authenticate all requests using Better Auth and validate that the `user_id` matches the authenticated user
- **FR-003**: System MUST retrieve complete conversation history from database before running the AI agent for each request
- **FR-004**: System MUST execute the OpenAI Agent SDK to process user input with full conversation context
- **FR-005**: System MUST register MCP tools at backend startup that handle all database operations for task management
- **FR-006**: System MUST persist both user messages and AI assistant responses to the database after each interaction
- **FR-007**: System MUST validate that MCP tools enforce user ownership when performing database operations
- **FR-008**: System MUST return structured responses containing conversation_id, response text, and tool calls executed
- **FR-009**: System MUST discard all in-memory data after each request to maintain stateless operation
- **FR-010**: System MUST handle authentication failures by returning HTTP 401 and authorization failures by returning HTTP 403

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a single thread of communication between a user and the AI assistant, containing metadata like creation timestamp and user association
- **Message**: Represents individual exchanges within a conversation, including content, sender type (user/assistant), timestamp, and associated conversation
- **Task**: Represents user's todo items with properties like title, description, status (pending/completed), deadlines, and user ownership

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can initiate and maintain AI-powered conversations to manage their todos with 95% successful task creation/update rate
- **SC-002**: System processes chat requests with average response time under 3 seconds for 90% of requests
- **SC-003**: Users can resume previous conversations and find their context intact 99% of the time
- **SC-004**: System handles authentication and authorization correctly, preventing unauthorized access to other users' data 100% of the time
- **SC-005**: AI assistant successfully interprets and acts on natural language requests to manage todos 90% of the time
- **SC-006**: System maintains stateless operation with zero data persistence between requests outside of database interactions
- **SC-007**: All database operations through MCP tools complete successfully 98% of the time under normal load conditions
