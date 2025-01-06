// SearchResults.tsx
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '../utils/format'

interface SearchResult {
  serial_number: string
  mark_identification: string
  registration_number: string | null
  status_code: string | null
  filing_date: string | null
  registration_date: string | null
  attorney_name: string | null
  similarity_score?: number
  phonetic_score?: number
  match_quality?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No results found. Please try a different search query.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Link
          key={result.serial_number}
          href={`/case/${result.serial_number}`}
          className="block"
        >
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800">
              {result.mark_identification}
            </h3>
            {(result.similarity_score || result.phonetic_score || result.match_quality) && (
              <div className="text-sm text-gray-600 mb-2">
                {result.similarity_score && (
                  <span>Similarity Score: {result.similarity_score.toFixed(2)}% | </span>
                )}
                {result.phonetic_score && (
                  <span>Phonetic Score: {result.phonetic_score.toFixed(2)}% | </span>
                )}
                {result.match_quality && (
                  <span>Match Quality: {result.match_quality}</span>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><span className="font-semibold">Serial Number:</span> {result.serial_number}</p>
              <p><span className="font-semibold">Registration Number:</span> {result.registration_number || 'N/A'}</p>
              <p><span className="font-semibold">Status:</span> {result.status_code || 'N/A'}</p>
              <p><span className="font-semibold">Filing Date:</span> {formatDate(result.filing_date)}</p>
              {result.registration_date && (
                <p><span className="font-semibold">Registration Date:</span> {formatDate(result.registration_date)}</p>
              )}
              <p><span className="font-semibold">Attorney:</span> {result.attorney_name || 'N/A'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

