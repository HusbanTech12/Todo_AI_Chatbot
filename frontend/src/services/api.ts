import { ApiResponse } from '@/src/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface SendMessageParams {
  userId: string;
  message: string;
  conversationId?: string;
}

/**
 * Send a message to the AI chatbot and receive a response
 * @param params - Contains userId, message, and optional conversationId
 * @returns Promise resolving to the API response
 */
export const sendMessage = async ({
  userId,
  message,
  conversationId
}: SendMessageParams): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 * @param userId - The ID of the user creating the conversation
 * @returns Promise resolving to the new conversation ID
 */
export const createConversation = async (userId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Start a new conversation',
        conversation_id: undefined
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.conversation_id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Get conversation history
 * @param userId - The ID of the user whose conversation history to retrieve
 * @param conversationId - The ID of the conversation to retrieve
 * @returns Promise resolving to the conversation history
 */
export const getConversationHistory = async (
  userId: string,
  conversationId: string
): Promise<any[]> => {
  // This would typically be a GET request to fetch conversation history
  // For now, we'll return an empty array as the actual endpoint may not exist
  console.warn('getConversationHistory not implemented in backend API');
  return [];
};