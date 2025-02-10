// WordmarkSuggestions.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CornerDownLeft } from 'lucide-react'
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
  const [optionsCount, setOptionsCount] = useState('9')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!term.trim()) return

    setIsLoading(true)
    setError(null)
    setSuggestions([])
    setShowSuggestions(false)

    try {
      const response = await fetch(API_ENDPOINTS.wordmarkGenerator, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          term: term.trim(),
          optionsCount: parseInt(optionsCount)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to produce suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions.slice(1))
      setShowSuggestions(true)
      setEnterPressCount(1)
    } catch (err) {
      setError('Failed to produce suggestions. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAll = async () => {
    setIsAddingAll(true)
    try {
      await onAddAllSuggestions?.([term.trim(), ...suggestions])
      setEnterPressCount(2)
    } finally {
      setIsAddingAll(false)
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      if (enterPressCount === 0) {
        handleSubmit(e as unknown as React.FormEvent)
      } else if (enterPressCount === 1 && suggestions.length > 0) {
        await handleAddAll()
      } else if (enterPressCount === 2) {
        onSearch?.()
        setEnterPressCount(0)
      }
    }
  }

  const handleOptionsChange = (value: string) => {
    const numValue = value.replace(/\D/g, '')
    if (numValue.length <= 2) {
      setOptionsCount(numValue || '9')
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Provide your term here to get adjacent terms that can improve search results</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value)
                setEnterPressCount(0)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your term to get suggested queries..."
              className="flex-1 pr-10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <HelpText text="Pressing Enter ↵ three times will: First, generate suggestions; Second, add all suggestions; Third, search" />
            </div>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={optionsCount}
            onChange={(e) => handleOptionsChange(e.target.value)}
            className="w-16 text-center"
            placeholder="9"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !term.trim()}
            className="whitespace-nowrap bg-black hover:bg-gray-800 text-white relative"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Get Suggestions
                {enterPressCount === 0 && (
                  <CornerDownLeft className="h-4 w-4 ml-2 animate-pulse" />
                )}
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            // Skeleton loader
            Array.from({ length: parseInt(optionsCount) }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 bg-gray-200 rounded animate-pulse"
              />
            ))
          ) : suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`bg-white hover:bg-gray-50 transition-all duration-300 ${
                    showSuggestions 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`
                  }}
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
                className="bg-black hover:bg-gray-800 text-white relative"
              >
                {isAddingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Add All
                    {enterPressCount === 1 && (
                      <CornerDownLeft className="h-4 w-4 ml-2 animate-pulse" />
                    )}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
} 