import React from 'react'
import { PriorRegistration } from '@/utils/types/case'
import InfoItem from '../shared/InfoItem'
import { getRelationshipTypeDescription } from '@/lib/utils'

interface PriorRegistrationsProps {
  priorRegistrations?: PriorRegistration[]
}

export default function PriorRegistrations({ priorRegistrations }: PriorRegistrationsProps) {
  const hasOtherRelated = priorRegistrations?.some(reg => reg.other_related_in) || false;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Prior Registrations / Claimed Ownership of U.S. Registrations
      </h2>
      {priorRegistrations && priorRegistrations.length > 0 ? (
        <>
          <div className="space-y-6">
            {priorRegistrations.map((reg, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <InfoItem
                  label="Registration/Application Number"
                  value={reg.number}
                />
                <InfoItem
                  label="Relationship Type"
                  value={getRelationshipTypeDescription(reg.relationship_type)}
                />
                {index < priorRegistrations.length - 1 && <hr className="my-4 border-gray-300" />}
              </div>
            ))}
          </div>
          {hasOtherRelated && (
            <div className="mt-4 text-gray-600 italic">
              And others...
            </div>
          )}
        </>
      ) : (
        <p>No prior registrations found.</p>
      )}
    </div>
  )
}

