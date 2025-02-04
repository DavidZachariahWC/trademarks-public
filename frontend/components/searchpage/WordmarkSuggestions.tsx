// WordmarkSuggestions.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'
import HelpText from './HelpText'

interface WordmarkSuggestionsProps {
  onSuggestionSelect: (suggestion: string) => void;
  onAddAllSuggestions?: (suggestions: string[]) => void;
  onSearch?: () => void;
}

export default function WordmarkSuggestions({ onSuggestionSelect, onAddAllSuggestions, onSearch }: WordmarkSuggestionsProps) {
  const [term, setTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAddingAll, setIsAddingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enterPressCount, setEnterPressCount] = useState(0)

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
      setEnterPressCount(1) // Set to 1 after generating suggestions
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
      setEnterPressCount(2) // Set to 2 after adding all suggestions
    } finally {
      setIsAddingAll(false)
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      if (enterPressCount === 0) {
        // First Enter: Generate suggestions
        handleSubmit(e as unknown as React.FormEvent)
      } else if (enterPressCount === 1 && suggestions.length > 0) {
        // Second Enter: Add all suggestions
        await handleAddAll()
      } else if (enterPressCount === 2) {
        // Third Enter: Trigger search
        onSearch?.()
        setEnterPressCount(0) // Reset counter after search
      }
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Provide your term here to get the adjacent spellings necessary for a more comprehensive result</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value)
                setEnterPressCount(0) // Reset counter when input changes
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your term to get suggested queries..."
              className="flex-1"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <HelpText text="Pressing Enter ↵ three times will: First, generate suggestions; Second, add all suggestions; Third, search" />
            </div>
          </div>
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