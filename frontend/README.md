# Todo AI Chatbot Frontend

This is the frontend for the Todo AI Chatbot, built with Next.js and React.

## Features

- Chat interface for interacting with the Todo AI
- Real-time messaging with the backend AI system
- Conversation continuity with conversation_id tracking
- Error handling and user-friendly error messages
- Responsive design for desktop and mobile

## Tech Stack

- Next.js 16.1.4
- React 19.2.3
- TypeScript
- Tailwind CSS
- OpenAI ChatKit
- Better Auth

## Environment Variables

Copy `.env.example` to `.env.local` and update the values as needed:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── chat/            # Chat page
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ChatContainer.tsx
│   ├── MessageList.tsx
│   ├── MessageBubble.tsx
│   ├── ChatInput.tsx
│   └── ErrorBanner.tsx
├── lib/                 # Shared utilities
│   ├── api.ts          # API client
│   └── auth.ts         # Auth client
├── tests/               # Test files
│   ├── contract/
│   ├── integration/
│   └── unit/
├── public/              # Static assets
├── .env.local           # Environment variables
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the backend through the `/api/{user_id}/chat` endpoint, sending and receiving messages in the following format:

Request:
```json
{
  "conversation_id": 12, // optional
  "message": "Add a task to buy groceries"
}
```

Response:
```json
{
  "conversation_id": 12,
  "response": "✅ Task added: Buy groceries",
  "tool_calls": ["add_task"]
}
```

## Components

- **ChatContainer**: Main component managing chat state and API communication
- **MessageList**: Displays the list of messages in the conversation
- **MessageBubble**: Individual message display component
- **ChatInput**: Input field for sending messages
- **ErrorBanner**: Displays user-friendly error messages

## Error Handling

The application handles various error scenarios:
- Network errors with user-friendly messages
- Backend API errors
- Authentication issues
- Retry mechanism for failed requests
