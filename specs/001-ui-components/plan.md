# Implementation Plan: UI Components for Todo AI Chatbot

**Branch**: `001-ui-components` | **Date**: 2026-02-03 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/001-ui-components/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of professional, animated UI components for the Todo AI Chatbot frontend following the chat-first, accessibility-focused design. The system will use Next.js with App Router, Tailwind CSS, Framer Motion for animations, and shadcn/ui for accessible components. The UI will be stateless, communicating with the backend API at `/api/{user_id}/chat` to handle all state and business logic.

## Technical Context

**Language/Version**: TypeScript 5.3+ with strict mode, Node.js 18+
**Primary Dependencies**: Next.js (App Router), React 18+, Tailwind CSS, Framer Motion, shadcn/ui, clsx, tailwind-merge
**Storage**: N/A (stateless frontend - all state managed by backend API)
**Testing**: Jest, React Testing Library, Cypress (for e2e tests)
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 15+)
**Project Type**: Web application (frontend for Todo AI Chatbot)
**Performance Goals**: 60fps animations, <3s initial load, <100ms input response, <200ms API response time
**Constraints**: Must respect `prefers-reduced-motion`, WCAG AA compliance, responsive design for all screen sizes, no business logic in UI layer
**Scale/Scope**: Single-page application supporting 10k+ concurrent users (via backend scaling)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Statelessness First**: Frontend will be stateless, all state comes from API responses, no in-memory session storage
- ✅ **Clear Separation of Responsibilities**: Frontend handles UI and message transport only, backend handles orchestration and persistence
- ✅ **Technology Constitution**: Using Next.js, Tailwind CSS, Framer Motion as planned (within allowed "Frontend (OpenAI ChatKit)" category)
- ✅ **Forbidden Actions Check**: Not storing state in memory, not accessing database directly, not mixing responsibilities

## Project Structure

### Documentation (this feature)

```text
specs/001-ui-components/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with AppShell
│   │   ├── page.tsx            # Main chat interface (ChatContainer)
│   │   └── globals.css         # Global styles and Tailwind imports
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (generated)
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx      # Main chat wrapper
│   │   │   ├── MessageList.tsx        # Scrollable message container
│   │   │   ├── MessageBubble.tsx      # Individual message display
│   │   │   ├── ChatInput.tsx          # Input field with send button
│   │   │   ├── TypingIndicator.tsx    # Animated typing dots
│   │   │   ├── EmptyState.tsx         # Welcome message when no chat
│   │   │   ├── ActionConfirmation.tsx # Success feedback component
│   │   │   └── ErrorBanner.tsx        # Error display component
│   │   └── layout/
│   │       └── AppShell.tsx           # Full-height background container
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (cn, etc.)
│   │   └── types.ts             # Shared TypeScript types
│   ├── hooks/
│   │   ├── useAutoScroll.ts     # Auto-scroll to bottom of chat
│   │   ├── useReducedMotion.ts  # Motion preference detection
│   │   └── useKeyboardNav.ts    # Keyboard navigation support
│   └── services/
│       └── api.ts               # API client for backend communication
├── public/
│   └── favicon.ico
├── styles/
│   └── globals.css              # Global styles and Tailwind imports
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

**Structure Decision**: Web application structure chosen since this is a frontend for the Todo AI Chatbot. The frontend directory contains all UI components following the Next.js App Router pattern with proper separation of concerns. Components are organized by functionality (chat components, layout components) with shared utilities and hooks.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [No violations found] | [All constitution requirements satisfied] |
