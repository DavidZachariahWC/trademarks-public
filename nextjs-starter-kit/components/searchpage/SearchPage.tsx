// SearchPage.tsx

'use client'

import { useState } from 'react'
import SearchResults from './SearchResults'
import SearchOptions from './SearchOptions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API_ENDPOINTS } from '@/lib/api-config'
import type { SearchResult } from '@/utils/types/case'

// Strategies that require date input in YYYY-MM-DD format
const DATE_STRATEGIES = new Set([
  'filing_date',
  'registration_date',
  'cancellation_date',
  'foreign_filing_date',
  'foreign_registration_date',
  'int_reg_date',
  'int_pub_date',
  'auto_protection_date',
  'published_opposition_date',
  'renewal_date',
  'international_renewal_date',
  'foreign_renewal_date'
])

// Strategies that are boolean filters (no user input required)
const BOOLEAN_STRATEGIES = new Set([
  'section_12c',
  'section_8',
  'section_15',
  'no_current_basis',
  'no_initial_basis',
  'change_registration',
  'concurrent_use',
  'concurrent_use_proceeding',
  'name_change',
  'color_drawing',
  'three_d_drawing',
  'prior_registration_present',
  'standard_character_claim',
  'acquired_distinctiveness_whole',
  'acquired_distinctiveness_part',
  'assignment_recorded',
  'priority_claimed',
  'first_refusal'
])

interface SearchFilter {
  strategy: string
  query: string
}

interface QueryPart {
  filter: SearchFilter
  operator: 'AND' | 'OR'
}

export default function SearchPage() {
  const [currentFilter, setCurrentFilter] = useState<SearchFilter>({ strategy: 'wordmark', query: '' })
  const [queryParts, setQueryParts] = useState<QueryPart[]>([])
  const [logicOperator, setLogicOperator] = useState<'AND' | 'OR'>('OR')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_results: 0,
    per_page: 10
  })

  const addToQuery = () => {
    if (!currentFilter.strategy || (!BOOLEAN_STRATEGIES.has(currentFilter.strategy) && !currentFilter.query)) {
      setError('Please select a search option and enter a query')
      return
    }

    setQueryParts([
      ...queryParts,
      { filter: currentFilter, operator: logicOperator }
    ])

    // Reset current filter
    setCurrentFilter({ strategy: 'wordmark', query: '' })
  }

  const removeQueryPart = (index: number) => {
    setQueryParts(queryParts.filter((_, i) => i !== index))
  }

  const validateDateFormat = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) return false

    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return dateObj.getFullYear() === year && 
           dateObj.getMonth() === month - 1 && 
           dateObj.getDate() === day
  }

  const handleSearch = async (page: number = 1) => {
    if (queryParts.length === 0 && !currentFilter.query) {
      setError('Please add at least one search filter')
      return
    }

    // Include current filter if it has a query
    const allFilters = currentFilter.query ? 
      [...queryParts.map(p => p.filter), currentFilter] :
      queryParts.map(p => p.filter)

    // Validate all date filters
    for (const filter of allFilters) {
      if (DATE_STRATEGIES.has(filter.strategy)) {
        if (!validateDateFormat(filter.query)) {
          setError(`Invalid date format for ${filter.strategy}. Please use YYYY-MM-DD format.`)
          return
        }
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.combinedSearch, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conditions: allFilters,
          logic_operator: logicOperator,
          page,
          per_page: pagination.per_page
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results)
      setPagination(data.pagination)
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={logicOperator} onValueChange={(value: 'AND' | 'OR') => setLogicOperator(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OR">OR</SelectItem>
                  <SelectItem value="AND">AND</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addToQuery}>
                Add to Query
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              {error}
            </Alert>
          )}

          {/* Display constructed query parts */}
          {queryParts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Constructed Query:</h3>
              <div className="space-y-2">
                {queryParts.map((part, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span className="font-semibold">{part.operator}</span>}
                    <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center gap-2">
                      <span>{part.filter.strategy}: {part.filter.query || 'true'}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQueryPart(index)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current filter selection */}
          <div className="flex items-center gap-4">
            <SearchOptions
              selectedOptions={new Set([currentFilter.strategy])}
              selectedBooleanOptions={new Set()}
              onOptionChange={(option, checked) => {
                if (checked) {
                  setCurrentFilter({ ...currentFilter, strategy: option })
                }
              }}
              onBooleanOptionChange={(option) => {
                setCurrentFilter({ strategy: option, query: 'true' })
              }}
            />
            {!BOOLEAN_STRATEGIES.has(currentFilter.strategy) && (
              DATE_STRATEGIES.has(currentFilter.strategy) ? (
                <Input
                  type="date"
                  value={currentFilter.query}
                  onChange={(e) => setCurrentFilter({ ...currentFilter, query: e.target.value })}
                  placeholder="YYYY-MM-DD"
                  className="flex-1"
                />
              ) : (
                <Input
                  type="text"
                  value={currentFilter.query}
                  onChange={(e) => setCurrentFilter({ ...currentFilter, query: e.target.value })}
                  placeholder="Enter search query..."
                  className="flex-1"
                />
              )
            )}
          </div>

          <Button 
            onClick={() => handleSearch(1)}
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      <SearchResults 
        results={results}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handleSearch}
      />
    </div>
  )
} 
