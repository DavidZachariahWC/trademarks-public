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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Plus, X, ChevronRight, Search } from 'lucide-react'
import { API_ENDPOINTS } from '@/lib/api-config'
import type { SearchResult } from '@/utils/types/case'
import CoordinatedClassSelector from './CoordinatedClassSelector'
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_results: 0,
    per_page: 10
  })

  const addToQuery = () => {
    // Only check for duplicates if we're not editing an existing filter
    if (editingIndex === null) {
      // Check if this strategy is already used in queryParts
      const isDuplicate = queryParts.some(part => part.filter.strategy === currentFilter.strategy);
      
      if (isDuplicate) {
        toast({
          title: "Filter already in use",
          description: "This filter type is already part of your query. Please use a different filter.",
          variant: "destructive"
        });
        return;
      }
    }

    if (editingIndex !== null) {
      const newQueryParts = [...queryParts];
      newQueryParts[editingIndex] = { 
        filter: currentFilter,
        operator: logicOperator 
      };
      setQueryParts(newQueryParts);
      setEditingIndex(null);
    } else {
      setQueryParts([...queryParts, { 
        filter: currentFilter,
        operator: logicOperator 
      }]);
    }
    
    // Reset current filter
    setCurrentFilter({
      strategy: 'wordmark',
      query: '',
      operator: logicOperator
    });
  }

  const startEditing = (index: number) => {
    const part = queryParts[index];
    setCurrentFilter(part.filter);
    setLogicOperator(part.operator);
    setEditingIndex(index);
    setIsSidebarOpen(false); // Close the sidebar if it's open
  }

  const removeQueryPart = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null)
      setCurrentFilter({ strategy: 'wordmark', query: '' })
    }
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

    // If we're editing, make sure to update the current part before searching
    let searchQueryParts = [...queryParts];
    if (editingIndex !== null) {
      searchQueryParts[editingIndex] = { filter: currentFilter, operator: logicOperator };
      setQueryParts(searchQueryParts);
      setEditingIndex(null);
      setCurrentFilter({ strategy: 'wordmark', query: '' });
    } else if (currentFilter.query) {
      // Only check for duplicates if we're not editing and have a current filter
      const wouldBeDuplicate = searchQueryParts.some(part => part.filter.strategy === currentFilter.strategy);
      if (wouldBeDuplicate) {
        toast({
          title: "Filter already in use",
          description: "This filter type is already part of your query. Please use a different filter.",
          variant: "destructive"
        });
        return;
      }
      searchQueryParts = [...searchQueryParts, { filter: currentFilter, operator: logicOperator }];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.combinedSearch, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conditions: searchQueryParts.map(p => ({
            strategy: p.filter.strategy,
            query: p.filter.query,
            operator: p.operator
          })),
          page,
          per_page: pagination.per_page
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
      setPagination(data.pagination);
      
      // After successful search, update queryParts if we added a new filter
      if (currentFilter.query && editingIndex === null) {
        setQueryParts(searchQueryParts);
      }
      setCurrentFilter({ strategy: 'wordmark', query: '' });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const renderQueryPart = (part: QueryPart, index: number, isPreview: boolean = false) => {
    const isEditing = editingIndex === index
    return (
      <div 
        key={index} 
        className={`flex items-center gap-3 flex-wrap bg-white p-3 rounded-md border 
          ${isPreview ? 'border-blue-300 border-dashed' : isEditing ? 'border-yellow-300 border-2' : 'border-gray-200'}
          ${!isPreview ? 'cursor-pointer hover:border-gray-400' : ''}`}
        onClick={() => !isPreview && startEditing(index)}
      >
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
        {!isPreview && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation()
              removeQueryPart(index)
            }} 
            className="ml-auto"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Remove</span>
          </Button>
        )}
      </div>
    )
  }

  // Function to check if current filter is valid for preview
  const shouldShowPreview = () => {
    return currentFilter.strategy && (
      BOOLEAN_STRATEGIES.has(currentFilter.strategy) || 
      currentFilter.query
    ) && editingIndex === null  // Don't show preview while editing
  }

  // Update the Button text based on whether we're editing or adding
  const getActionButtonText = () => {
    if (editingIndex !== null) {
      return (
        <>
          <Plus className="h-5 w-5" />
          Update Query
        </>
      )
    }
    return (
      <>
        <Plus className="h-5 w-5" />
        Add to Query
      </>
    )
  }

  const handleClassSelect = (classes: string[]) => {
    setCurrentFilter({ ...currentFilter, query: classes.join(',') })
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center space-y-10">
      <Toaster />
      <div className="w-full max-w-6xl space-y-8">
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
            <SheetContent side="left" className="w-[600px] sm:w-[800px]">
              <SheetTitle className="text-xl font-semibold mb-4">
                Search Options
              </SheetTitle>
              <div className="h-[calc(100vh-4rem)] overflow-y-auto pr-4">
                <SearchOptions
                  selectedOptions={new Set([currentFilter.strategy])}
                  selectedBooleanOptions={new Set()}
                  onOptionChange={(option, checked) => {
                    if (checked) {
                      setCurrentFilter({ 
                        strategy: option, 
                        query: BOOLEAN_STRATEGIES.has(option) ? 'true' : ''  // Only clear for non-boolean filters
                      })
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
                className="flex-1 h-12 text-lg max-w-xl"
              />
            ) : currentFilter.strategy === 'coordinated_class' ? (
              <div className="flex-1">
                <CoordinatedClassSelector onClassSelect={handleClassSelect} />
              </div>
            ) : (
              <Input
                type="text"
                value={currentFilter.query}
                onChange={(e) => setCurrentFilter({ ...currentFilter, query: e.target.value })}
                placeholder="Enter search query..."
                className="flex-1 h-12 text-lg max-w-xl"
              />
            )
          )}

          <Button 
            onClick={addToQuery}
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={!currentFilter.strategy || (!BOOLEAN_STRATEGIES.has(currentFilter.strategy) && !currentFilter.query)}
          >
            {getActionButtonText()}
          </Button>
        </div>
      </div>

      <div id="current-query" className="w-full max-w-6xl space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Current Query</h2>
        <div className="bg-gray-100 p-6 rounded-lg min-h-[100px] flex items-center justify-center border border-gray-300 shadow-sm">
          {queryParts.length === 0 && !shouldShowPreview() ? (
            <p className="text-gray-500 text-lg">No conditions added yet.</p>
          ) : (
            <div className="space-y-4 w-full">
              {queryParts.map((part, index) => renderQueryPart(part, index))}
              {shouldShowPreview() && renderQueryPart(
                { 
                  filter: currentFilter, 
                  operator: logicOperator 
                }, 
                queryParts.length,
                true
              )}
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
