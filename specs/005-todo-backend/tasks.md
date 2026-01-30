# Tasks: Todo AI Chatbot Backend

## Overview

This document contains the implementation tasks for the Todo AI Chatbot Backend. The backend is a stateless execution engine that orchestrates AI conversations, executes OpenAI Agents SDK, exposes MCP tools, and persists all state to PostgreSQL.

**Feature**: Todo AI Chatbot Backend
**Branch**: `005-todo-backend`
**Dependencies**: Python 3.11, FastAPI, OpenAI Agents SDK, Official MCP SDK, SQLModel, Neon Serverless PostgreSQL, Better Auth

## Phase 1: Setup

**Goal**: Establish a clean, constitution-compliant backend skeleton.

- [x] T001 Create backend directory structure
- [x] T002 Initialize Python project with requirements.txt
- [x] T003 Install dependencies: fastapi, uvicorn, sqlmodel, openai-agents-sdk, official-mcp-sdk, asyncpg, better-auth
- [x] T004 Create environment configuration with .env file
- [x] T005 [P] Create main.py with basic FastAPI app structure
- [x] T006 Create health check endpoint in main.py

## Phase 2: Foundational

**Goal**: Implement blocking prerequisites for all user stories.

- [x] T007 Create database models for Task entity in backend/models/task.py
- [x] T008 Create database models for Conversation entity in backend/models/conversation.py
- [x] T009 Create database models for Message entity in backend/models/message.py
- [x] T010 Create database session management in backend/db/session.py
- [x] T011 [P] Create authentication middleware in backend/auth/middleware.py
- [x] T012 Setup database connection and session factory
- [x] T013 Create database migration scripts
- [x] T014 [P] Initialize MCP server framework in backend/mcp/tools.py

## Phase 3: User Story 1 - Start and Continue AI-Powered Todo Conversations (P1)

**Goal**: Enable users to interact with an AI-powered chatbot to manage their todos through natural language conversations.

**Independent Test**: Can be fully tested by sending a message to the chat endpoint and verifying that the AI understands the request and performs the appropriate todo management action, delivering immediate value for basic todo operations.

- [x] T015 [US1] Create chat API endpoint in backend/api/chat.py
- [x] T016 [US1] Implement authentication validation in chat endpoint
- [x] T017 [US1] [P] Create todo agent definition in backend/agents/todo_agent.py
- [x] T018 [US1] Implement conversation history retrieval logic
- [x] T019 [US1] Implement user message persistence logic
- [x] T020 [US1] Integrate AI agent with conversation context
- [x] T021 [US1] Implement assistant response persistence
- [x] T022 [US1] Return structured response with tool calls
- [x] T023 [US1] Test basic "Add a task to buy groceries" scenario

## Phase 4: User Story 2 - Maintain Conversation State Across Sessions (P2)

**Goal**: Ensure conversation context is maintained even after closing and reopening the application.

- [x] T024 [US2] Enhance conversation persistence with proper timestamps
- [x] T025 [US2] Implement conversation history reconstruction
- [x] T026 [US2] Add conversation_id handling for new/existing conversations
- [x] T027 [US2] Test conversation resumption after simulated session restart
- [x] T028 [US2] Validate contextual message interpretation with historical context

## Phase 5: User Story 3 - Secure Access to Personal Todo Data (P1)

**Goal**: Ensure todo data is securely isolated from other users' data.

- [x] T029 [US3] Implement user ownership validation in database queries
- [x] T030 [US3] Add user_id validation in authentication middleware
- [x] T031 [US3] Implement authorization checks for all data access
- [x] T032 [US3] Test that user A cannot access user B's conversations
- [x] T033 [US3] Validate authentication failure responses (HTTP 401/403)

## Phase 6: User Story 4 - Execute AI-Driven Actions Through MCP Tools (P2)

**Goal**: Enable AI assistant to perform actions like creating, updating, and deleting tasks via MCP tools.

- [x] T034 [US4] Implement add_task MCP tool in backend/mcp/tools.py
- [x] T035 [US4] Implement list_tasks MCP tool in backend/mcp/tools.py
- [x] T036 [US4] Implement complete_task MCP tool in backend/mcp/tools.py
- [x] T037 [US4] Implement delete_task MCP tool in backend/mcp/tools.py
- [x] T038 [US4] Implement update_task MCP tool in backend/mcp/tools.py
- [x] T039 [US4] Register MCP tools with the todo agent
- [x] T040 [US4] Validate tool schema compliance with contracts
- [x] T041 [US4] Test tool execution with natural language commands
- [x] T042 [US4] Validate tool ownership checks with user_id

## Phase 7: Error Handling & Resilience

**Goal**: Ensure graceful failures as defined in the specification.

- [x] T043 [P] Implement normalized MCP tool error handling
- [x] T044 [P] Handle task-not-found cases in tools
- [x] T045 [P] Protect agent runner from crashes
- [x] T046 Return user-friendly error responses
- [x] T047 Validate no uncaught exceptions

## Phase 8: Observability & Hardening

**Goal**: Production readiness with proper logging and monitoring.

- [x] T048 [P] Add structured logging for request lifecycle
- [x] T049 [P] Add logging for MCP tool calls
- [x] T050 [P] Add error logging without PII
- [x] T051 [P] Add request correlation IDs
- [x] T052 Validate statelessness under load
- [x] T053 Run concurrency tests

## Phase 9: Polish & Cross-Cutting Concerns

**Goal**: Final integration and validation of all components.

- [x] T054 Integrate all components for end-to-end testing
- [x] T055 Validate stateless operation (no memory retention between requests)
- [x] T056 Test server restart without data loss
- [x] T057 Verify all constitutional requirements are met
- [x] T058 Performance testing to meet response time goals
- [x] T059 Update documentation and README

## Dependencies

**User Story Completion Order**:
1. Phase 3 (US1) must complete before Phase 4 (US2) - conversation management builds on basic chat functionality
2. Phase 5 (US3) should complete early to ensure security across all other phases
3. Phase 6 (US4) can develop in parallel with Phase 3 after foundational components are in place

**Critical Path**: T001 → T005 → T007-T012 → T015 → T017 → T020 → T039

## Parallel Execution Opportunities

**Within US1**:
- T017 [P] [US1] (todo agent) can run in parallel with T015 [US1] (chat API)
- T018 [US1] (history retrieval) can run in parallel with T019 [US1] (message persistence)

**Within US4**:
- T034-T038 [P] [US4] (MCP tools) can be developed in parallel as they are independent

**Across Stories**:
- T029-T033 [US3] (security) can be implemented in parallel with other stories as cross-cutting concern

## Implementation Strategy

**MVP Scope (Phase 1 + Phase 2 + Phase 3)**: Basic chat functionality with AI agent that can add tasks through MCP tools, minimal security.

**Incremental Delivery**:
1. MVP: US1 (P1) - Basic chat with task creation
2. Iteration 2: US3 (P1) - Security enhancements
3. Iteration 3: US2 (P2) - Conversation state management
4. Iteration 4: US4 (P2) - Full MCP tool integration
5. Iteration 5: Error handling and observability