import { NextResponse } from 'next/server';

const TIMEOUT_DURATION = 60000; // 60 seconds for export (it can take longer)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/export_search`, {
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

    // Get the response headers
    const contentType = response.headers.get('content-type');
    const contentDisposition = response.headers.get('content-disposition');

    // Get the response data as array buffer
    const data = await response.arrayBuffer();

    // Return the Excel file with appropriate headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': contentDisposition || 'attachment; filename=export.xlsx',
      },
    });
  } catch (error: any) {
    console.error('Export search API error:', error);
    
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