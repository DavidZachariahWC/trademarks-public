'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { submitFeedback } from '@/utils/actions/feedback';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const { userId } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitFeedback({
        email: email || null,
        message: message.trim(),
        pageUrl: pathname,
        userId: userId || null
      });

      if (!result.success) throw result.error;
      
      // Reset form and close modal
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#111318] rounded-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Send Feedback, We&apos;re listening!</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email (optional) for follow-up
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={250}
              rows={4}
              required
              className="w-full px-3 py-2 bg-zinc-900 border border-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
              placeholder="Request features... Report issues..."
            />
            <p className="text-sm text-gray-400 mt-1">
              {message.length}/250 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-[#FF6B2C] text-white py-2 px-4 rounded-md hover:bg-[#FF6B2C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
} 