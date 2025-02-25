// ai-chat/case-data/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('sn');
    const registrationNumber = searchParams.get('rn');

    if (!serialNumber && !registrationNumber) {
      return NextResponse.json(
        { error: 'Serial number or registration number is required' },
        { status: 400 }
      );
    }

    // Construct the appropriate USPTO API URL based on available parameters
    let pdfUrl = 'https://tsdrapi.uspto.gov/ts/cd/casedocs/bundle.pdf';
    if (registrationNumber) {
      pdfUrl += `?rn=${registrationNumber.replace(/[^0-9]/g, '')}`;
    } else if (serialNumber) {
      pdfUrl += `?sn=${serialNumber.replace(/[^0-9]/g, '')}`;
    }

    // Fetch the PDF from USPTO
    const response = await fetch(pdfUrl, {
      headers: {
        'USPTO-API-KEY': process.env.USPTO_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`USPTO API responded with status: ${response.status}`);
    }

    // Get the PDF data
    const pdfData = await response.arrayBuffer();
    const base64Data = Buffer.from(pdfData).toString('base64');

    return NextResponse.json({
      success: true,
      pdfData: base64Data,
      documentUrl: pdfUrl,
    });
  } catch (error) {
    console.error('Error fetching USPTO case data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch USPTO case data' },
      { status: 500 }
    );
  }
} 