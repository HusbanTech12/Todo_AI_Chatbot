# Data Model: Todo AI Chatbot Backend

## Entity Definitions

### Task
**Description**: Represents a single todo item in the system

**Fields**:
- `id`: Integer (Primary Key, Auto-generated)
- `user_id`: Integer (Foreign Key to user, required for ownership validation)
- `title`: String (Required, maximum 255 characters)
- `description`: String (Optional, maximum 1000 characters)
- `completed`: Boolean (Default: false)
- `created_at`: DateTime (Auto-generated timestamp)
- `updated_at`: DateTime (Auto-generated timestamp, updated on changes)

**Validation Rules**:
- Title must not be empty
- User_id must correspond to an existing user
- Title length must be between 1-255 characters
- Description length must be under 1000 characters if provided

**State Transitions**:
- New task: completed = false by default
- Updated task: can change title, description, or completed status
- Deleted task: soft delete (marked as deleted rather than removed)

### Conversation
**Description**: Represents a chat session between a user and the AI assistant

**Fields**:
- `id`: Integer (Primary Key, Auto-generated)
- `user_id`: Integer (Foreign Key to user, required for ownership validation)
- `created_at`: DateTime (Auto-generated timestamp)
- `updated_at`: DateTime (Auto-generated timestamp, updated on changes)

**Validation Rules**:
- User_id must correspond to an existing user
- Cannot be created without valid user_id

**State Transitions**:
- New conversation: created with current timestamp
- Active conversation: updated_at refreshed when messages are added

### Message
**Description**: Represents individual exchanges within a conversation

**Fields**:
- `id`: Integer (Primary Key, Auto-generated)
- `user_id`: Integer (Foreign Key to user, required for ownership validation)
- `conversation_id`: Integer (Foreign Key to conversation, required)
- `role`: String (Required, values: "user" or "assistant")
- `content`: Text (Required, the actual message content)
- `created_at`: DateTime (Auto-generated timestamp)

**Validation Rules**:
- User_id must match the conversation owner
- Role must be either "user" or "assistant"
- Content must not be empty
- Conversation_id must correspond to an existing conversation

**State Transitions**:
- New message: created with current timestamp and immutable content

## Relationships

### User to Conversations
- One user can have many conversations
- Foreign key: user_id in conversations table

### Conversation to Messages
- One conversation can have many messages
- Foreign key: conversation_id in messages table

### User to Tasks
- One user can have many tasks
- Foreign key: user_id in tasks table

## Constraints

### Ownership Validation
- All operations must validate that user_id matches the authenticated user
- Cross-user data access must be prevented at the database level

### Timestamp Management
- created_at is set only once on creation
- updated_at is automatically updated on any modification
- Both fields use UTC timezone

### Data Integrity
- Referential integrity enforced through foreign keys
- Required fields cannot be null
- Unique constraints where appropriate

## Indexes

### Performance Indexes
- Index on user_id for all tables (frequent filtering)
- Index on conversation_id in messages table (frequent joins)
- Composite index on (user_id, completed) in tasks table (common queries)
- Index on created_at in messages table (chronological ordering)

## MCP Tool Data Contracts

### add_task Input Contract
```
{
  "user_id": Integer (required),
  "title": String (required, 1-255 chars),
  "description": String (optional, 0-1000 chars)
}
```

### add_task Output Contract
```
{
  "success": Boolean,
  "task_id": Integer,
  "message": String
}
```

### list_tasks Input Contract
```
{
  "user_id": Integer (required),
  "status": String (optional, values: "pending", "completed", "all")
}
```

### list_tasks Output Contract
```
{
  "success": Boolean,
  "tasks": Array[{
    "id": Integer,
    "title": String,
    "description": String,
    "completed": Boolean,
    "created_at": DateTime,
    "updated_at": DateTime
  }]
}
```

### complete_task Input Contract
```
{
  "user_id": Integer (required),
  "task_id": Integer (required)
}
```

### complete_task Output Contract
```
{
  "success": Boolean,
  "message": String
}
```

### delete_task Input Contract
```
{
  "user_id": Integer (required),
  "task_id": Integer (required)
}
```

### delete_task Output Contract
```
{
  "success": Boolean,
  "message": String
}
```

### update_task Input Contract
```
{
  "user_id": Integer (required),
  "task_id": Integer (required),
  "title": String (optional),
  "description": String (optional),
  "completed": Boolean (optional)
}
```

### update_task Output Contract
```
{
  "success": Boolean,
  "message": String
}
```