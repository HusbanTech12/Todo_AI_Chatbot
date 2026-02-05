# Quickstart Guide: UI Components for Todo AI Chatbot

## Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher (or yarn/bun)
- Git for version control
- Modern web browser (Chrome 90+, Firefox 88+, Safari 15+)

## Setup Instructions

### 1. Clone and Navigate to Frontend Directory
```bash
# If frontend directory doesn't exist yet, create it
mkdir frontend && cd frontend
```

### 2. Initialize Next.js Project
```bash
npm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 3. Install Additional Dependencies
```bash
npm install framer-motion lucide-react @radix-ui/react-slot
```

### 4. Set Up shadcn/ui (Optional but recommended for accessibility)
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button input textarea card alert
```

### 5. Install Testing Libraries
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Project Structure Setup

After installation, your frontend directory should look like:

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── chat/
│   │       ├── ChatContainer.tsx
│   │       ├── MessageList.tsx
│   │       ├── MessageBubble.tsx
│   │       ├── ChatInput.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── utils.ts
│   │   └── types.ts
│   ├── hooks/
│   │   └── ...
│   └── services/
│       └── api.ts
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

## Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Running the Application

### Development Mode
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application running.

### Production Build
```bash
npm run build
npm start
```

## Key Scripts Reference

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (if configured)

## API Integration Point

The frontend communicates with the backend through the API endpoint:
- POST `/api/{user_id}/chat` - Send messages and receive AI responses

## Next Steps

1. Implement the AppShell component for the full-height layout
2. Create the ChatContainer component with centered design
3. Build the MessageList and MessageBubble components with animations
4. Implement the ChatInput component with proper focus management
5. Add accessibility features and reduced motion support