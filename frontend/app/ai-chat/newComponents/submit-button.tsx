"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export function SubmitButton({ children, disabled, loading, onClick }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className="relative text-white h-12"
    >
      {loading ? (
        <span className="animate-spin">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      ) : (
        <Send className="h-4 w-4" />
      )}
      <span className="sr-only">{loading ? "Loading" : "Send message"}</span>
    </Button>
  );
}
