import React from 'react'
import { formatDate } from '@/lib/utils'
import type { MadridFiling, MadridHistoryEvent } from '@/utils/types/case'
import InfoItem from '@/components/shared/InfoItem'

interface MadridInfoProps {
  filings?: MadridFiling[]
  historyEvents?: MadridHistoryEvent[]
}

export default function MadridInfo({ filings, historyEvents }: MadridInfoProps) {
  if (!filings || filings.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Madrid Protocol Information</h2>
      <div className="space-y-6">
        {filings.map((filing, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                label="Filing Entry Number" 
                value={filing.madrid_filing_entry_number} 
              />
              <InfoItem 
                label="Reference Number" 
                value={filing.reference_number} 
              />
              <InfoItem 
                label="Original USPTO Filing Date" 
                value={formatDate(filing.original_filing_date_uspto)} 
              />
              <InfoItem 
                label="International Registration Number" 
                value={filing.madrid_international_registration_number} 
              />
              <InfoItem 
                label="International Registration Date" 
                value={formatDate(filing.madrid_international_registration_date)} 
              />
              <InfoItem 
                label="Filing Status Code" 
                value={filing.madrid_international_filing_status_code} 
              />
              <InfoItem 
                label="Filing Status Date" 
                value={formatDate(filing.madrid_international_filing_status_date)} 
              />
              <InfoItem 
                label="Irregularity Reply By Date" 
                value={formatDate(filing.irregularity_reply_by_date)} 
              />
              <InfoItem 
                label="Filing Renewal Date" 
                value={formatDate(filing.madrid_international_filing_renewal_date)} 
              />
            </div>

            {/* Display history events related to this filing */}
            {historyEvents && historyEvents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">History Events</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entry Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historyEvents.map((event, eventIndex) => (
                        <tr key={eventIndex} className={eventIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.madrid_history_event_code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(event.madrid_history_event_date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {event.event_description_text}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.madrid_history_entry_number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {index < filings.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
} 