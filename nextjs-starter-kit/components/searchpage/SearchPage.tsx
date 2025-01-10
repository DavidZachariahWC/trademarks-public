// SearchPage.tsx

'use client'

import { useState } from 'react'
import SearchResults from './SearchResults'
import SearchOptions from './SearchOptions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Plus, X, ChevronRight, Search } from 'lucide-react'
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
  operator?: 'AND' | 'OR'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

    // Include current filter if it has a query, and map conditions to include operators
    const allFilters = queryParts.map(p => ({
      strategy: p.filter.strategy,
      query: p.filter.query,
      operator: p.operator
    }))

    if (currentFilter.query) {
      allFilters.push({
        strategy: currentFilter.strategy,
        query: currentFilter.query,
        operator: logicOperator
      })
    }

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

  const renderQueryPart = (part: QueryPart, index: number) => (
    <div key={index} className="flex items-center gap-3 flex-wrap bg-white p-3 rounded-md border border-gray-200">
      {index > 0 && (
        <Badge 
          variant="secondary" 
          className={`text-base font-bold px-3 py-1 ${
            part.operator === 'AND' ? 'bg-blue-100' : 'bg-green-100'
          }`}
        >
          {part.operator}
        </Badge>
      )}
      <Badge variant="outline" className="text-base font-medium px-3 py-1">
        {part.filter.strategy}
      </Badge>
      {BOOLEAN_STRATEGIES.has(part.filter.strategy) ? (
        <Badge variant="secondary" className="text-base font-medium px-3 py-1 bg-yellow-100">
          IS TRUE
        </Badge>
      ) : (
        <>
          <span className="px-2">=</span>
          <span className="italic bg-gray-100 px-3 py-1 rounded-md text-base">
            {part.filter.query}
          </span>
        </>
      )}
      <Button variant="ghost" size="icon" onClick={() => removeQueryPart(index)} className="ml-auto">
        <X className="h-5 w-5" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center space-y-10">
      <div className="w-full max-w-4xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Federal Trademark Database Search
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {queryParts.length > 0 && (
            <Button
              variant="outline"
              className={`w-28 h-12 text-lg font-semibold ${
                logicOperator === 'AND' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200'
              }`}
              onClick={() => setLogicOperator(prev => prev === 'AND' ? 'OR' : 'AND')}
            >
              {logicOperator}
            </Button>
          )}

          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-64 h-12 text-lg font-semibold justify-between">
                {currentFilter.strategy}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[500px] sm:w-[675px]">
              <div className="h-[calc(100vh-4rem)] overflow-y-auto pr-4">
                <SearchOptions
                  selectedOptions={new Set([currentFilter.strategy])}
                  selectedBooleanOptions={new Set()}
                  onOptionChange={(option, checked) => {
                    if (checked) {
                      setCurrentFilter({ ...currentFilter, strategy: option })
                      setIsSidebarOpen(false)
                    }
                  }}
                  onBooleanOptionChange={(option) => {
                    setCurrentFilter({ strategy: option, query: 'true' })
                    setIsSidebarOpen(false)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {!BOOLEAN_STRATEGIES.has(currentFilter.strategy) && (
            DATE_STRATEGIES.has(currentFilter.strategy) ? (
              <Input
                type="date"
                value={currentFilter.query}
                onChange={(e) => setCurrentFilter({ ...currentFilter, query: e.target.value })}
                placeholder="YYYY-MM-DD"
                className="flex-1 h-12 text-lg"
              />
            ) : (
              <Input
                type="text"
                value={currentFilter.query}
                onChange={(e) => setCurrentFilter({ ...currentFilter, query: e.target.value })}
                placeholder="Enter search query..."
                className="flex-1 h-12 text-lg"
              />
            )
          )}

          <Button 
            onClick={addToQuery}
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={!currentFilter.strategy || (!BOOLEAN_STRATEGIES.has(currentFilter.strategy) && !currentFilter.query)}
          >
            <Plus className="h-5 w-5" />
            Add to Query
          </Button>
        </div>
      </div>

      <div id="current-query" className="w-full max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Current Query</h2>
        <div className="bg-gray-100 p-6 rounded-lg min-h-[100px] flex items-center justify-center border border-gray-300 shadow-sm">
          {queryParts.length === 0 ? (
            <p className="text-gray-500 text-lg">No conditions added yet.</p>
          ) : (
            <div className="space-y-4 w-full">
              {queryParts.map((part, index) => renderQueryPart(part, index))}
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={() => handleSearch(1)}
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={queryParts.length === 0 && !currentFilter.query}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </div>

      <SearchResults 
        results={results}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handleSearch}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
} 
