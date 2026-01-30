# API Contract: Todo AI Chatbot Backend

## Overview
This document defines the API contracts for the Todo AI Chatbot Backend, following constitutional requirements.

## Chat API

### Endpoint: POST /api/{user_id}/chat

#### Description
Main endpoint for chat interactions with the AI assistant. Handles natural language processing for todo management tasks.

#### Path Parameters
- `user_id` (string, required): Unique identifier for the authenticated user

#### Request Body
```json
{
  "conversation_id": 123,
  "message": "Add a task to buy groceries"
}
```

##### Fields
- `conversation_id` (integer, optional): Existing conversation ID. If omitted, a new conversation will be created.
- `message` (string, required): Natural language message from the user.

#### Response Body
```json
{
  "conversation_id": 123,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

##### Fields
- `conversation_id` (integer): Active conversation ID (either provided or newly created)
- `response` (string): AI-generated natural language response
- `tool_calls` (array[string]): List of MCP tools invoked during processing

#### Error Responses
- `401 Unauthorized`: Invalid or expired authentication token
- `403 Forbidden`: User attempting to access another user's data
- `500 Internal Server Error`: Server-side processing error

#### Constitutional Compliance
- Stateless: No session data stored between requests
- Ownership Verified: Enforces user_id matches authenticated user
- Natural Language: Accepts natural language commands

## Authentication

### Session Management
All requests must include a valid Better Auth session token in the headers:
```
Authorization: Bearer <token>
```

## MCP Tool Contracts

### add_task
- **Input**: task title (string), description (optional string)
- **Output**: created task ID (integer)
- **Effect**: Creates new task for authenticated user

### list_tasks
- **Input**: status filter (optional string: "all", "pending", "completed")
- **Output**: array of task objects
- **Effect**: Returns tasks for authenticated user

### complete_task
- **Input**: task ID (integer)
- **Output**: boolean success indicator
- **Effect**: Marks task as completed for authenticated user

### delete_task
- **Input**: task ID (integer)
- **Output**: boolean success indicator
- **Effect**: Deletes task for authenticated user

### update_task
- **Input**: task ID (integer), new title (optional string), new description (optional string)
- **Output**: boolean success indicator
- **Effect**: Updates task details for authenticated user