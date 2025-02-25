// /app/api/combined-search/route.ts
import { NextResponse } from 'next/server';

const TIMEOUT_DURATION = 25000; // 25 seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the request
    console.log('Combined search request:', {
      url: process.env.NEXT_PUBLIC_API_URL,
      body: body
    });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/combined_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { error: `Backend error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {  // Type as any since we need to access .name and .message
    console.error('Search API error:', error);
    
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Search request timed out. Please try again or refine your search criteria.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 