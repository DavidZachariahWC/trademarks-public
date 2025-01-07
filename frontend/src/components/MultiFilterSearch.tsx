// MultiFilterSearch.tsx
import React, { useState, ChangeEvent } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { SearchResult } from '../types/case'
import SearchResults from './SearchResults'
import { Button, Select, Input, Alert } from '../components/ui'

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

// Map of available search strategies
const SEARCH_STRATEGIES = {
  wordmark: 'Word Mark',
  owner_name: 'Owner Name',
  attorney: 'Attorney',
  phonetic: 'Phonetic',
  section_12c: 'Section 12(c)',
  section_8: 'Section 8',
  section_15: 'Section 15',
  foreign_priority: 'Foreign Priority',
  foreign_registration: 'Foreign Registration',
  extension_protection: 'Extension Protection',
  no_current_basis: 'No Current Basis',
  no_initial_basis: 'No Initial Basis',
  international_class: 'International Class',
  us_class: 'US Class',
  coordinated_class: 'Coordinated Class',
  cancellation_date: 'Cancellation Date',
  change_registration: 'Change Registration',
  concurrent_use: 'Concurrent Use',
  concurrent_use_proceeding: 'Concurrent Use Proceeding',
  disclaimer_statements: 'Disclaimer Statements',
  description_of_mark: 'Description of Mark',
  dba_name: 'DBA Name',
  name_change: 'Name Change',
  filing_date: 'Filing Date',
  foreign_filing_date: 'Foreign Filing Date',
  int_reg_number: 'International Registration Number',
  int_reg_date: 'International Registration Date',
  int_pub_date: 'International Publication Date',
  auto_protection_date: 'Auto Protection Date',
  int_status_code: 'International Status Code',
  priority_claimed: 'Priority Claimed',
  first_refusal: 'First Refusal',
  drawing_code_type: 'Drawing Code Type',
  color_drawing: 'Color Drawing',
  three_d_drawing: '3D Drawing',
  design_code: 'Design Code',
  published_opposition_date: 'Published Opposition Date',
  prior_registration_present: 'Prior Registration Present',
  registration_date: 'Registration Date',
  foreign_registration_date: 'Foreign Registration Date',
  renewal_date: 'Renewal Date',
  international_renewal_date: 'International Renewal Date',
  foreign_renewal_date: 'Foreign Renewal Date',
  standard_character_claim: 'Standard Character Claim',
  acquired_distinctiveness_whole: 'Acquired Distinctiveness (Whole)',
  acquired_distinctiveness_part: 'Acquired Distinctiveness (Part)',
  serial_number: 'Serial Number',
  registration_number: 'Registration Number',
  assignment_recorded: 'Assignment Recorded',
  owner_legal_entity: 'Owner Legal Entity',
  owner_party_type: 'Owner Party Type',
  priority_date_range: 'Priority Date Range'
}

interface SearchFilter {
  strategy: string
  query: string
}

const MultiFilterSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilter[]>([{ strategy: 'wordmark', query: '' }])
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

  const addFilter = () => {
    if (filters.length >= 20) {
      setError('Maximum of 20 filters allowed')
      return
    }
    setFilters([...filters, { strategy: 'wordmark', query: '' }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const validateDateFormat = (date: string): boolean => {
    // Check if the date matches YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) return false

    // Validate the date is actually valid
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return dateObj.getFullYear() === year && 
           dateObj.getMonth() === month - 1 && 
           dateObj.getDate() === day
  }

  const updateFilter = (index: number, field: keyof SearchFilter, value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [field]: value }

    // Clear any previous errors
    setError(null)

    // If changing to a date strategy, validate any existing query
    if (field === 'strategy' && DATE_STRATEGIES.has(value) && newFilters[index].query) {
      if (!validateDateFormat(newFilters[index].query)) {
        setError('Please enter date in YYYY-MM-DD format')
        return
      }
    }

    // If updating a query for a date strategy, validate the new value
    if (field === 'query' && DATE_STRATEGIES.has(newFilters[index].strategy)) {
      if (value && !validateDateFormat(value)) {
        setError('Please enter date in YYYY-MM-DD format')
        return
      }
    }

    setFilters(newFilters)
  }

  const handleSearch = async (page: number = 1) => {
    // Validate filters
    const validFilters = filters.filter(f => f.query.trim() !== '')
    if (validFilters.length === 0) {
      setError('At least one filter with a query is required')
      return
    }

    // Validate all date filters
    for (const filter of validFilters) {
      if (DATE_STRATEGIES.has(filter.strategy)) {
        if (!validateDateFormat(filter.query)) {
          setError(`Invalid date format for ${SEARCH_STRATEGIES[filter.strategy as keyof typeof SEARCH_STRATEGIES]}. Please use YYYY-MM-DD format.`)
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
          conditions: validFilters,
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
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-4 mb-4">
          <Select
            value={logicOperator}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setLogicOperator(e.target.value as 'AND' | 'OR')}
            className="w-24"
          >
            <option value="OR">OR</option>
            <option value="AND">AND</option>
          </Select>
          <Button 
            onClick={addFilter}
            disabled={filters.length >= 20}
          >
            Add Filter
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-4">
            <Select
              value={filter.strategy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => updateFilter(index, 'strategy', e.target.value)}
              className="w-64"
            >
              {Object.entries(SEARCH_STRATEGIES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            {DATE_STRATEGIES.has(filter.strategy) ? (
              <Input
                type="date"
                value={filter.query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateFilter(index, 'query', e.target.value)}
                placeholder="YYYY-MM-DD"
                className="flex-1"
              />
            ) : (
              <Input
                type="text"
                value={filter.query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateFilter(index, 'query', e.target.value)}
                placeholder="Enter search query..."
                className="flex-1"
              />
            )}
            {filters.length > 1 && (
              <Button 
                variant="destructive"
                onClick={() => removeFilter(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        <Button 
          onClick={() => handleSearch(1)}
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
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

export default MultiFilterSearch 