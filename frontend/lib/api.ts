// Base API client for chat endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface ChatRequestPayload {
  conversation_id?: number;
  message: string;
}

interface ChatResponsePayload {
  conversation_id: number;
  response: string;
  tool_calls: string[];
}

interface ErrorResponse {
  error: string;
  message: string;
}

export interface ChatSession {
  conversation_id: number | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface Message {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatInputState {
  inputValue: string;
  isDisabled: boolean;
}

export interface AuthState {
  userId: string;
  isLoggedIn: boolean;
}

/**
 * Send a chat message to the backend API with retry mechanism
 */
export async function sendChatMessage(
  userId: string,
  payload: ChatRequestPayload,
  retries: number = 3
): Promise<ChatResponsePayload> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Check if the response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error: ErrorResponse = await response.json();
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        } else {
          // If not JSON, create a generic error message
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${text.substring(0, 100)}...`);
        }
      }

      const data: ChatResponsePayload = await response.json();
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        // If this was the last attempt, throw the error
        console.error('All retry attempts failed');
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Retry attempts exhausted');
}

/**
 * Handle network errors and display user-friendly messages
 */
export function handleApiError(error: any): string {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.message.includes('401')) {
    return 'Authentication required. Please log in.';
  }

  if (error.message.includes('400')) {
    return 'Invalid request. Please try again.';
  }

  return 'An error occurred. Please try again.';
}