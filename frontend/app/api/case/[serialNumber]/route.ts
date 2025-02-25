// /app/api/case/[serialNumber]/route.ts
import { NextResponse } from 'next/server';

const TIMEOUT_DURATION = 60000; // 60 seconds

export async function GET(request: Request) {
  try {
    // Extract serial number from URL
    const url = new URL(request.url);
    console.log('Request URL:', url.toString());
    const serialNumber = url.pathname.split('/api/case/')[1];
    console.log('Raw serial number from URL:', serialNumber);

    if (!serialNumber) {
      return NextResponse.json({ error: 'Serial number is required' }, { status: 400 });
    }

    // Ensure serial number is a valid integer
    const parsedSerialNumber = parseInt(serialNumber.replace(/[^0-9]/g, ''), 10);
    console.log('Parsed serial number:', parsedSerialNumber);
    
    if (isNaN(parsedSerialNumber)) {
      return NextResponse.json({ error: 'Invalid serial number format' }, { status: 400 });
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/case/${parsedSerialNumber}`;
    console.log('Calling backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', {
        url: backendUrl,
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
    console.log('Successfully retrieved case data for serial number:', parsedSerialNumber);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Case details API error:', error);
    
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