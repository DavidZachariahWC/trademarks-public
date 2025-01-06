import React from 'react'

interface PriorRegistration {
  number: string
  other_related_in: boolean
  relationship_type: string
}

interface PriorRegistrationsProps {
  priorRegistrations: PriorRegistration[]
}

export default function PriorRegistrations({ priorRegistrations }: PriorRegistrationsProps) {
  const getRelationshipType = (type: string) => {
    switch (type) {
      case '1': return 'Child Case'
      case '2': return 'Parent Case'
      case '3': return 'Cross Reference'
      default: return type
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Prior Registrations / Claimed Ownership of U.S. Registrations</h2>
      {priorRegistrations.length > 0 ? (
        <div className="space-y-4">
          {priorRegistrations.map((reg, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <p><span className="font-semibold">Registration/Application Number:</span> {reg.number}</p>
              <p><span className="font-semibold">Other Related:</span> {reg.other_related_in ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Relationship Type:</span> {getRelationshipType(reg.relationship_type)}</p>
              {index < priorRegistrations.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}
        </div>
      ) : (
        <p>No prior registrations found.</p>
      )}
    </div>
  )
}

