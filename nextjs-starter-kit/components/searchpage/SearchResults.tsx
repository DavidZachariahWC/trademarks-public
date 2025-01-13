// SearchResults.tsx
import React from 'react'
import Link from 'next/link'
import { SearchResult, Pagination } from '@/utils/types/case'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  pagination?: Pagination
  onPageChange?: (page: number) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading,
  pagination,
  onPageChange 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 w-full max-w-6xl mx-auto">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className="text-center p-8 text-gray-500 w-full max-w-6xl mx-auto">
        No results found
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Link
            key={result.serial_number}
            href={`/case/${result.serial_number}`}
            className="block p-6 border rounded-lg hover:bg-gray-50 transition-colors h-full"
          >
            <h3 className="text-lg font-semibold line-clamp-2 mb-3">{result.mark_identification}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Serial Number:</span> {result.serial_number}
              </div>
              <div>
                <span className="font-medium">Registration Number:</span>{' '}
                {result.registration_number || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {result.status_code}
              </div>
              <div>
                <span className="font-medium">Filing Date:</span>{' '}
                {formatDate(result.filing_date)}
              </div>
              {result.similarity_score && (
                <div>
                  <span className="font-medium">Match Score:</span>{' '}
                  {Math.round(result.similarity_score)}%
                </div>
              )}
              {result.match_quality && (
                <div>
                  <span className="font-medium">Match Quality:</span>{' '}
                  {result.match_quality}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            onClick={() => onPageChange?.(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <Button
            onClick={() => onPageChange?.(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_pages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default SearchResults

