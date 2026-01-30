# Data Model: Todo AI Chatbot Backend

## Overview
This document defines the data model for the Todo AI Chatbot Backend, following constitutional requirements for Task, Conversation, and Message entities.

## Entity Definitions

### Task Entity
- **Purpose**: Represents a single todo item
- **Fields**:
  - `id`: Integer (Primary Key, Auto-increment)
  - `user_id`: String (Foreign Key to user, required)
  - `title`: String (required, max 255 chars)
  - `description`: Text (optional)
  - `completed`: Boolean (default: False)
  - `created_at`: DateTime (auto-populated)
  - `updated_at`: DateTime (auto-updated)
- **Validation**:
  - Title must not be empty
  - User_id must reference valid user
- **Relationships**:
  - Belongs to one User
  - Owned by single user (enforced by user_id)

### Conversation Entity
- **Purpose**: Represents a chat session
- **Fields**:
  - `id`: Integer (Primary Key, Auto-increment)
  - `user_id`: String (Foreign Key to user, required)
  - `created_at`: DateTime (auto-populated)
  - `updated_at`: DateTime (auto-updated)
- **Validation**:
  - User_id must reference valid user
- **Relationships**:
  - Belongs to one User
  - Has many Messages
  - Owned by single user (enforced by user_id)

### Message Entity
- **Purpose**: Represents a single utterance in a conversation
- **Fields**:
  - `id`: Integer (Primary Key, Auto-increment)
  - `user_id`: String (Foreign Key to user, required)
  - `conversation_id`: Integer (Foreign Key to conversation, required)
  - `role`: String (required, values: "user" | "assistant")
  - `content`: Text (required)
  - `created_at`: DateTime (auto-populated)
- **Validation**:
  - Role must be either "user" or "assistant"
  - User_id must match conversation owner
  - Conversation_id must reference valid conversation
- **Relationships**:
  - Belongs to one User
  - Belongs to one Conversation
  - Owned by single user (enforced by user_id)

### User Entity
- **Purpose**: Represents an authenticated user
- **Fields**:
  - `id`: String (Primary Key, from auth provider)
  - `email`: String (unique, required)
  - `name`: String (optional)
  - `created_at`: DateTime (auto-populated)
  - `updated_at`: DateTime (auto-updated)
- **Validation**:
  - Email must be valid and unique
- **Relationships**:
  - Has many Tasks
  - Has many Conversations
  - Has many Messages

## Relationship Constraints

### Ownership Enforcement
- All entities enforce ownership via user_id field
- MCP tools must validate ownership before operations
- Chat endpoint must validate user_id matches authenticated user

### Referential Integrity
- Messages must reference valid conversation
- Messages and Conversations must reference valid user
- Tasks must reference valid user

## Indexes
- Index on user_id for all entities (performance for ownership queries)
- Index on conversation_id for Message entity (performance for conversation retrieval)
- Index on created_at for Message entity (performance for chronological ordering)