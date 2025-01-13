import React from 'react'
import { CaseHeader } from '@/utils/types/case'
import { formatDate } from '@/lib/utils'

interface SectionStatusProps {
  header: CaseHeader
}

export default function SectionStatus({ header }: SectionStatusProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Section Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 15 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Section 15</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium mr-2">Filed:</span>
              <span>{header.section_15_filed_in ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Acknowledged:</span>
              <span>{header.section_15_acknowledged_in ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Section 8</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium mr-2">Partial Accept:</span>
              <span>{header.section_8_partial_accept_in ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Accepted:</span>
              <span>{header.section_8_accepted_in ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Section 12(c) */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Section 12(c)</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium mr-2">Republished:</span>
              {header.republished_12c_date ? (
                <span>{formatDate(header.republished_12c_date)}</span>
              ) : (
                <span>No</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 