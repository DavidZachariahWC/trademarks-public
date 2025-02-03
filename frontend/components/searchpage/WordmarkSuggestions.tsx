// WordmarkSuggestions.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'

interface WordmarkSuggestionsProps {
  onSuggestionSelect: (suggestion: string) => void;
  onAddAllSuggestions?: (suggestions: string[]) => void;
}

export default function WordmarkSuggestions({ onSuggestionSelect, onAddAllSuggestions }: WordmarkSuggestionsProps) {
  const [term, setTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingAll, setIsAddingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!term.trim()) return

    setIsLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const response = await fetch(API_ENDPOINTS.wordmarkGenerator, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: term.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions.slice(1))
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAll = async () => {
    setIsAddingAll(true)
    try {
      await onAddAllSuggestions?.([term.trim(), ...suggestions])
    } finally {
      setIsAddingAll(false)
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Provide your term for all spellings necessary for a comprehensive result</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Enter a term to get suggestions..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !term.trim()}
            className="whitespace-nowrap bg-black hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Get Suggestions'
            )}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAll}
              disabled={isAddingAll}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isAddingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Add All'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
} 