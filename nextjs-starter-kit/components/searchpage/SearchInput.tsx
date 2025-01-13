// SearchInput.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'

interface SearchInputProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const suggestionsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length >= 2) {
      try {
        const response = await fetch(`${API_ENDPOINTS.autocomplete}?prefix=${encodeURIComponent(value)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error('Autocomplete request failed:', error)
        setSuggestions([])
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    onSearch(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(query)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search for trademarks..."
          className="w-full p-4 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={() => onSearch(query)}
          disabled={isLoading}
          className="absolute right-2 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Search"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Search className="h-6 w-6" />
          )}
        </button>
      </div>
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

