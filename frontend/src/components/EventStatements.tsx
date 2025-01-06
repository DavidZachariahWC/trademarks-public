import React from 'react'
import { EventStatement } from '../types/case'
import { formatDate } from '../utils/format'

interface EventStatementsProps {
  eventStatements: EventStatement[]
}

export default function EventStatements({ eventStatements }: EventStatementsProps) {
  if (!eventStatements || eventStatements.length === 0) {
    return null
  }

  // Sort event statements by date in descending order (most recent first)
  const sortedStatements = [...eventStatements].sort((a, b) => {
    if (!a.event_date) return 1
    if (!b.event_date) return -1
    return new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  })

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Event History</h2>
      <div className="space-y-4">
        {sortedStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
              <div>
                <span className="font-semibold">Event Code:</span>{' '}
                <code className="bg-gray-200 px-2 py-1 rounded">{statement.event_code}</code>
                {statement.event_type && (
                  <>
                    <span className="mx-2">|</span>
                    <span className="font-semibold">Type:</span>{' '}
                    <code className="bg-gray-200 px-2 py-1 rounded">{statement.event_type}</code>
                  </>
                )}
              </div>
              {statement.event_date && (
                <div className="text-gray-600">
                  {formatDate(statement.event_date, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
            </div>
            {statement.description_text && (
              <p className="mt-2">{statement.description_text}</p>
            )}
            {statement.event_number && (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Event Number:</span> {statement.event_number}
              </p>
            )}
            {index < sortedStatements.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
} 