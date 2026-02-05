# Data Model: UI Components for Todo AI Chatbot

## Core Entities

### Message
Represents a single chat message in the UI layer (not to be confused with backend data model)

- `id`: string - Unique identifier for the message in the UI
- `content`: string - The text content of the message
- `sender`: 'user' | 'assistant' | 'system' - Identifies who sent the message
- `timestamp`: Date - When the message was created/displayed
- `status`: 'sent' | 'pending' | 'error' - Status for optimistic UI updates
- `parentId?`: string - Optional reference to parent message for threading

### ChatState
Represents the current state of the chat interface in the UI layer

- `messages`: Message[] - Array of all messages in the current conversation
- `inputValue`: string - Current value of the chat input field
- `isLoading`: boolean - Whether the AI is currently processing
- `error?`: string - Any error message to display
- `isConnected`: boolean - Connection status to backend API

### UI Configuration
Configuration object for UI behavior and styling

- `theme`: 'light' | 'dark' - Current theme preference
- `motionPreference`: 'reduce' | 'allow' - User's motion preference
- `maxWidth`: number - Maximum width for chat container (720-800px per spec)
- `animationDurations`: object - Duration settings for different animations (fast: 120-150ms, normal: 180-220ms, slow: 280-320ms)

## State Transitions

### Message State Transitions
- `pending` → `sent` (successful API response)
- `pending` → `error` (failed API response)
- `error` → `pending` (retry attempt)

### Chat State Transitions
- `disconnected` → `idle` (connection established)
- `idle` → `loading` (user submits message)
- `loading` → `idle` (AI response received)
- `idle` → `error` (network/API error)

## Validation Rules

### Message Validation
- Content must not exceed 10,000 characters (prevent extremely long messages)
- Sender must be one of the allowed values ('user', 'assistant', 'system')
- Timestamp must be a valid date object

### Input Validation
- Input value must not be empty whitespace when submitting
- Input must support multiline (Shift+Enter for newlines)
- Maximum input length of 10,000 characters

## UI-Specific Constraints

### Animation Constraints
- Respect `prefers-reduced-motion` system preference
- Animation durations must follow specified ranges
- No blocking of user interactions during animations

### Accessibility Constraints
- All interactive elements must have proper ARIA labels
- Keyboard navigation must be fully supported
- Color contrast must meet WCAG AA standards
- Focus management must be predictable and logical

### Responsive Design Constraints
- Chat container must center on desktop (max-width 720-800px)
- Chat container must be full-width on mobile
- Touch targets must be at least 44px for mobile accessibility