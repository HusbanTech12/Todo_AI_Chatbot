import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // Extract the userId from the URL parameters
    const { userId } = await params;

    // Verify that the user is authenticated and that the userId matches the authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to access chat functionality' },
        { status: 401 }
      );
    }

    // Ensure the authenticated user can only access their own chat
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only access your own chat' },
        { status: 403 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Get the backend API URL from environment variables
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000/api';

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with backend' },
      { status: 500 }
    );
  }
}