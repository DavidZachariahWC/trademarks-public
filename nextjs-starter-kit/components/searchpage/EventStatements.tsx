import React, { useState } from 'react'
import { EventStatement } from '@/utils/types/case'
import { formatDate } from '@/lib/utils'

interface EventStatementsProps {
  eventStatements: EventStatement[]
}

export default function EventStatements({ eventStatements }: EventStatementsProps) {
  const [isOpen, setIsOpen] = useState(false)

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
      <h2 className="text-2xl font-bold mb-4">Prosecution History</h2>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors text-left font-semibold text-lg"
      >
        {isOpen ? 'Hide Prosecution History' : 'Reveal Prosecution History'}
      </button>
      
      {isOpen && (
        <div className="space-y-4 mt-4">
          {sortedStatements.map((statement, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
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
                <p className="mt-2 text-lg font-semibold">{statement.description_text}</p>
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
      )}
    </div>
  )
} 