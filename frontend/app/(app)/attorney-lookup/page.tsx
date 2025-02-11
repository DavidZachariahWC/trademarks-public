'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { API_ENDPOINTS } from '@/lib/api-config'

interface SearchResult {
  serial_number: string
  registration_number: string | null
  mark_identification: string
  status_code: string
  filing_date: string | null
  registration_date: string | null
  attorney_name: string
}

function AttorneyLookupContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const attorneyName = searchParams.get('q')

  useEffect(() => {
    const fetchResults = async () => {
      if (!attorneyName) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(API_ENDPOINTS.combinedSearch, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conditions: [{
              strategy: 'attorney_name',
              query: attorneyName,
              operator: 'OR'
            }],
            page: currentPage,
            per_page: 20
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }

        const data = await response.json()
        setResults(data.results)
        setTotalPages(Math.ceil(data.pagination.total_pages))
      } catch (err) {
        setError('Failed to fetch results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [attorneyName, currentPage])

  if (!attorneyName) {
    return <div className="p-6">No attorney name provided</div>
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  if (results.length === 0) {
    return <div className="p-6">No results found for attorney: {attorneyName}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Search Results for Attorney: {attorneyName}</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filing Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/case/${result.serial_number}`} className="text-blue-600 hover:underline">
                    {result.mark_identification}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{result.serial_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{result.registration_number || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(result.filing_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{result.registration_date ? formatDate(result.registration_date) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default function AttorneyLookup() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AttorneyLookupContent />
    </Suspense>
  )
} 