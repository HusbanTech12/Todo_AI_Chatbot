import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // Extract the userId from the URL parameters
    const { userId } = await params;

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