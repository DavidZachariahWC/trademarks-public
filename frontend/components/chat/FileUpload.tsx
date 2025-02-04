import React, { useCallback, useRef } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Invalid file type', {
        description: 'Please upload a PDF file',
      });
      return;
    }

    // Validate file size (20MB limit)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > MAX_SIZE) {
      toast.error('File too large', {
        description: 'Please upload a PDF smaller than 20MB',
      });
      return;
    }

    try {
      await onFileSelect(file);
      // Reset the input
      event.target.value = '';
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Upload failed', {
        description: 'Failed to process the PDF. Please try again.',
      });
    }
  }, [onFileSelect]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
        aria-label="Upload PDF"
      />
      <Button 
        variant="outline" 
        className="w-full"
        disabled={isLoading}
        type="button"
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4 mr-2" />
            Upload PDF
          </>
        )}
      </Button>
    </div>
  );
} 