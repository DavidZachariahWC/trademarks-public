import React from 'react'
import { formatDate } from '@/lib/utils'

interface ForeignApplication {
  foreign_country: string
  foreign_other?: string
  foreign_filing_date: string | null
}

interface ForeignFilingDatesProps {
  foreignApplications: ForeignApplication[]
}

export default function ForeignFilingDates({ foreignApplications }: ForeignFilingDatesProps) {
  if (foreignApplications.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Foreign Filing Dates</h2>
      <div className="space-y-4">
        {foreignApplications.map((app, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <p>
              <span className="font-semibold">Country:</span>{' '}
              {app.foreign_country}
              {app.foreign_other && ` (${app.foreign_other})`}
            </p>
            <p>
              <span className="font-semibold">Filing Date:</span>{' '}
              {formatDate(app.foreign_filing_date)}
            </p>
            {index < foreignApplications.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
}

