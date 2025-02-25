// /app/api/uspto-docs/[registrationNumber]/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationNumber = searchParams.get('rn');

    if (!registrationNumber) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }

    const url = `https://tsdrapi.uspto.gov/ts/cd/casedocs/bundle.pdf?rn=${registrationNumber}`;

    console.log('Fetching USPTO documents from:', url);

    const response = await fetch(url, {
      headers: {
        'USPTO-API-KEY': process.env.USPTO_API_KEY || '',
      },
    });

    if (!response.ok) {
      // Try to get more detailed error information
      let errorDetail;
      try {
        errorDetail = await response.json(); // Try to parse as JSON first
      } catch {
        try {
          errorDetail = await response.text(); // Fallback to text
        } catch {
          errorDetail = 'No additional error details available';
        }
      }

      // Handle 404 specifically, but also provide more context for other errors
      if (response.status === 404) {
        return NextResponse.json({
          error: 'Documents not found',
          details: `No documents found for registration number ${registrationNumber}. This could be because the documents are not available through the USPTO or the registration number is incorrect.`,
          url: url,
          responseStatus: response.status,
          responseDetail: errorDetail // Include any details from the USPTO
        }, { status: 404 });
      }

      // Provide more informative error for other status codes
      return NextResponse.json({
        error: 'Failed to fetch USPTO documents',
        details: `USPTO API responded with status: ${response.status}`,
        url: url,
        responseStatus: response.status,
        responseDetail: errorDetail // Include any details from the USPTO
      }, { status: response.status }); // Use the actual status code
    }

    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="uspto-registration-${registrationNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching USPTO documents:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch USPTO documents',
        details: error?.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
} 