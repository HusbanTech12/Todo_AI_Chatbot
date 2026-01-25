# Data Model: Frontend Implementation for Todo AI Chatbot

**Feature**: Frontend Implementation
**Date**: 2026-01-25
**Status**: Complete

## Frontend UI State Models

### ChatSession (UI State Only)
Represents the frontend's view of a conversation session

**Fields**:
- `conversation_id: number | null` - Current conversation identifier (null for new conversations)
- `messages: Message[]` - List of messages in the current session
- `isLoading: boolean` - Whether a request is currently in progress
- `error: string | null` - Error message if any occurred

**Relationships**: None (UI-only state)

**Validation**:
- `conversation_id` must be positive integer when not null
- `messages` must be an array of valid Message objects
- `isLoading` is boolean
- `error` is either string or null

### Message (UI State Only)
Represents a single message in the UI

**Fields**:
- `id: string | number` - Unique identifier for UI rendering
- `role: "user" | "assistant"` - Who sent the message
- `content: string` - The message text
- `timestamp: Date` - When the message was created

**Relationships**: Belongs to a ChatSession

**Validation**:
- `role` must be either "user" or "assistant"
- `content` must be a non-empty string
- `timestamp` must be a valid date

## API Request/Response Models

### ChatRequestPayload
The payload sent to the backend API

**Fields**:
- `conversation_id: number | undefined` - Optional conversation identifier
- `message: string` - The user's message

**Validation**:
- `message` must be a non-empty string
- `conversation_id` must be positive integer if provided

### ChatResponsePayload
The response received from the backend API

**Fields**:
- `conversation_id: number` - The conversation identifier
- `response: string` - The AI's response
- `tool_calls: string[]` - Array of tools called (for debugging)

**Validation**:
- `conversation_id` must be a positive integer
- `response` must be a non-empty string
- `tool_calls` must be an array of strings

## Component State Models

### ChatInputState
State for the chat input component

**Fields**:
- `inputValue: string` - Current value in the input field
- `isDisabled: boolean` - Whether the input should be disabled

**Validation**:
- `inputValue` must be a string
- `isDisabled` must be a boolean

### AuthState
Authentication state from Better Auth

**Fields**:
- `userId: string` - The authenticated user's identifier
- `isLoggedIn: boolean` - Whether the user is authenticated

**Validation**:
- `userId` must be a non-empty string when `isLoggedIn` is true
- `isLoggedIn` must be a boolean

## Constraints

- All data models are UI-only and do not represent the backend data model
- Frontend never stores or manages task data directly
- All persistent data comes from backend API responses
- State is ephemeral and lost on page refresh (except auth session managed by Better Auth)