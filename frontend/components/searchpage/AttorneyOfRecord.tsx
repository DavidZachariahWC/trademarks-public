import React from 'react'
import { formatAttorneys } from '@/lib/utils'

interface AttorneyOfRecordProps {
  attorney_name: string | null
  attorney_docket_number: string | null
  domestic_representative_name: string | null
}

export default function AttorneyOfRecord({ 
  attorney_name,
  attorney_docket_number,
  domestic_representative_name
}: AttorneyOfRecordProps) {
  // If all fields are null or empty, don't render the section
  if (!attorney_name && !attorney_docket_number && !domestic_representative_name) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Attorney of Record</h2>
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700">Attorney Name:</span>{' '}
          <span className="text-gray-900">
            {formatAttorneys(attorney_name) || 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Attorney Docket Number:</span>{' '}
          <span className="text-gray-900">
            {attorney_docket_number || 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Domestic Representative:</span>{' '}
          <span className="text-gray-900">
            {domestic_representative_name || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
} 