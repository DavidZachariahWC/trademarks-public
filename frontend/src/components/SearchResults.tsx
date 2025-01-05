import { Loader2 } from 'lucide-react'

interface SearchResultsProps {
  results: any[]
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
        <div
          key={result.serial_number}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <h3 className="text-xl font-semibold mb-2">{result.mark_identification}</h3>
          <div className="text-sm text-gray-600 mb-2">
            <span>Similarity Score: {result.similarity_score?.toFixed(2)}% | </span>
            <span>Phonetic Score: {result.phonetic_score?.toFixed(2)}% | </span>
            <span>Match Quality: {result.match_quality}</span>
          </div>
          <p>Serial Number: {result.serial_number}</p>
          <p>Registration Number: {result.registration_number || 'N/A'}</p>
          <p>Status: {result.status_code || 'N/A'}</p>
          <p>Filing Date: {new Date(result.filing_date).toLocaleDateString()}</p>
          {result.registration_date && (
            <p>Registration Date: {new Date(result.registration_date).toLocaleDateString()}</p>
          )}
          <p>Attorney: {result.attorney_name || 'N/A'}</p>
        </div>
      ))}
    </div>
  )
}

