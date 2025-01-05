'use client'

import { useState } from 'react'
import SearchOptions from './SearchOptions'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import Pagination from './Pagination'
import ErrorMessage from './ErrorMessage'
import { API_ENDPOINTS } from '@/lib/api-config'

export default function TrademarkSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [results, setResults] = useState([])
  const [selectedOptions, setSelectedOptions] = useState(new Set(['wordmark']))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string, page = 1) => {
    setSearchQuery(query)
    setCurrentPage(page)
    setError(null)
    setIsLoading(true)

    const searchParams = new URLSearchParams()
    searchParams.append('query', query)
    searchParams.append('page', page.toString())
    selectedOptions.forEach(option => searchParams.append('type[]', option))

    try {
      const response = await fetch(`${API_ENDPOINTS.search}?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data.results)
        setTotalPages(data.pagination.total_pages)
      }
    } catch (error) {
      console.error('Search request failed:', error)
      setError('An error occurred while searching. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionChange = (option: string, checked: boolean) => {
    setSelectedOptions(prevOptions => {
      const newOptions = new Set(prevOptions)
      if (checked) {
        newOptions.add(option)
      } else {
        newOptions.delete(option)
      }
      return newOptions
    })
  }

  return (
    <div className="space-y-8">
      <SearchOptions selectedOptions={selectedOptions} onOptionChange={handleOptionChange} />
      <SearchInput onSearch={handleSearch} isLoading={isLoading} />
      {error && <ErrorMessage message={error} />}
      <SearchResults results={results} isLoading={isLoading} />
      {!error && results.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handleSearch(searchQuery, page)}
        />
      )}
    </div>
  )
}

