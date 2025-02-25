// /app/api/upload-pdf/route.ts marked for deletion

import { NextResponse } from 'next/server';
import { GoogleAIFileManager } from '@google/generative-ai/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Must be a PDF.' }, { status: 400 });
    }

    const pdfData = await file.arrayBuffer();
    
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');
    const uploadResult = await fileManager.uploadFile(
      pdfData.toString(),
      {
        mimeType: 'application/pdf',
        displayName: `USPTO Document - ${Date.now()}`,
      }
    );

    return NextResponse.json({ fileUri: uploadResult.file.uri });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error.message },
      { status: 500 }
    );
  }
} 