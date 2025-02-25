// /app/api/search/route.ts
// this endpoint is not utilized. All searches go through the combined search endpoint.

import { NextResponse } from 'next/server';

const TIMEOUT_DURATION = 25000; // 25 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const searchTypes = searchParams.getAll('type[]');
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '10';

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    // Construct the URL with query parameters
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/search`);
    url.searchParams.set('query', query);
    searchTypes.forEach(type => url.searchParams.append('type[]', type));
    url.searchParams.set('page', page);
    url.searchParams.set('per_page', perPage);

    const response = await fetch(url.toString(), {
      method: 'GET',
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
  } catch (error: any) {
    console.error('Search API error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 