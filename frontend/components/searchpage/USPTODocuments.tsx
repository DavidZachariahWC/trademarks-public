import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface USPTODocumentsProps {
  registrationNumber?: string;
  serialNumber: string;
  applicationDate?: string;
}

interface ErrorState {
  message: string;
  details?: string;
}

export function USPTODocuments({
  registrationNumber,
}: USPTODocumentsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const downloadDocuments = async () => {
    if (!registrationNumber) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/uspto-docs?rn=${registrationNumber}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Set error state with detailed information
        setError({
          message: errorData.error || 'Failed to fetch documents',
          details: errorData.details,
        });

        // Also show a toast for immediate feedback
        if (response.status === 404) {
          toast.error('Documents Not Found', {
            description: 'Opening details...',
            duration: 3000,
          });
        } else {
          toast.error('Download Failed', {
            description: 'Opening details...',
            duration: 3000,
          });
        }
        return;
      }

      // Handle successful download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uspto-registration-${registrationNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Clear any existing error
      setError(null);
      toast.success('Documents downloaded successfully');
    } catch (err) {
      console.error('Error downloading documents:', err);
      setError({
        message: 'Failed to download documents',
        details: 'An unexpected error occurred while downloading the documents. Please try again later.',
      });
      toast.error('Download Failed', {
        description: 'Opening details...',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {registrationNumber && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={downloadDocuments}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download Registration Documents
          </Button>
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] p-3">
                <p className="text-sm">
                  These documents will be automatically available to the AI chat assistant when you start a conversation.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Error Dialog */}
      <Dialog open={error !== null} onOpenChange={(open) => !open && setError(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <DialogTitle className="text-destructive">{error?.message}</DialogTitle>
            </div>
            {error?.details && (
              <DialogDescription className="mt-4 text-sm space-y-2">
                {error.details.split('\n').map((line, i) => (
                  <p key={i}>{line.trim()}</p>
                ))}
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
} 