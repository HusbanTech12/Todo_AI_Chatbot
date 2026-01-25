# API Contract: Chat Endpoint for Todo AI Chatbot

**Feature**: Frontend Implementation
**Date**: 2026-01-25
**Status**: Complete

## Endpoint: POST /api/{user_id}/chat

### Purpose
Main endpoint for chat interactions between frontend and backend AI system.

### Request
**Method**: POST
**Path**: `/api/{user_id}/chat`
**Content-Type**: `application/json`

#### Path Parameters
- `user_id`: String identifier for the authenticated user

#### Request Body
```json
{
  "conversation_id": 12,
  "message": "Add a task to buy groceries"
}
```

**Schema**:
- `conversation_id`: Optional number (positive integer) - Identifies existing conversation or omitted for new conversation
- `message`: Required string (non-empty) - The user's message to the AI assistant

### Response
**Status Codes**:
- `200`: Success - AI response generated
- `401`: Unauthorized - User not authenticated
- `400`: Bad Request - Invalid request format
- `500`: Internal Server Error - Backend error

#### Success Response (200)
```json
{
  "conversation_id": 12,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

**Schema**:
- `conversation_id`: Number - The conversation identifier (new or existing)
- `response`: String - The AI's response to display to user
- `tool_calls`: Array of strings - Tools that were invoked (for debugging/tracking)

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "User not authenticated"
}
```

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request format"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred processing your request"
}
```

### Security Requirements
- User must be authenticated via Better Auth session
- All requests must be scoped by user_id
- No direct access to MCP tools from frontend

### Performance Requirements
- Response time should be under 5 seconds for typical requests
- Connection timeout at 30 seconds

### Error Handling
- Network errors should be caught and displayed as user-friendly messages
- Server errors should not expose internal details to user
- Client should allow user to retry failed requests