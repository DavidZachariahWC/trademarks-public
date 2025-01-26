import React, { useState } from 'react'
import { legalEntityTypes } from '@/utils/constants/legalEntityTypes'
import { partyTypes, getOwnershipHistory } from '@/utils/constants/partyTypes'

interface Owner {
  owner_entry_number: number
  party_type: number
  party_name: string
  owner_address_1: string
  owner_address_2?: string
  city?: string
  owner_state?: string
  postcode?: string
  owner_country?: string
  owner_other?: string
  dba_aka_text?: string
  entity_statement?: string
  composed_of_statement?: string
  name_change_explanation?: string
  nationality_country?: string
  nationality_state?: string
  nationality_other?: string
  legal_entity_type_code: number
}

interface OwnerInfoProps {
  owners: Owner[]
}

function OwnerDetails({ owner }: { owner: Owner }) {
  return (
    <>
      <div className="ml-4 space-y-1 text-gray-700">
        <p>Address:</p>
        <p>{owner.owner_address_1}</p>
        {owner.owner_address_2 && <p>{owner.owner_address_2}</p>}
        <p>
          {owner.city && `${owner.city}, `}
          {owner.owner_state && `${owner.owner_state} `}
          {owner.postcode}
        </p>
        {owner.owner_country && <p>{owner.owner_country}</p>}
      </div>

      {owner.dba_aka_text && (
        <p className="mt-2">
          <span className="font-semibold" title="Doing Business As / Also Known As">DBA/AKA:</span>{' '}
          <span className="text-blue-600">{owner.dba_aka_text}</span>
        </p>
      )}

      {owner.entity_statement && (
        <p className="mt-2">
          <span className="font-semibold">Entity Type:</span> {owner.entity_statement}
        </p>
      )}

      {owner.composed_of_statement && (
        <p className="mt-2">
          <span className="font-semibold" title="Statement describing the composition of the entity">Composed Of:</span>{' '}
          <span className="text-blue-800 italic">{owner.composed_of_statement}</span>
        </p>
      )}

      {owner.name_change_explanation && (
        <p className="mt-2">
          <span className="font-semibold" title="Explanation of owner name change">Name Change:</span>{' '}
          <span className="text-blue-800 italic">{owner.name_change_explanation}</span>
        </p>
      )}

      <div className="mt-4">
        <p className="font-semibold mb-1">State or Country Where Organized:</p>
        <p>
          {owner.nationality_country || owner.nationality_state
            ? `${owner.nationality_country || ''}${owner.nationality_country && owner.nationality_state ? ', ' : ''}${owner.nationality_state || ''}`
            : 'N/A'}
        </p>
        {owner.nationality_other && (
          <p className="mt-1">
            <span className="font-semibold" title="Additional nationality information">Other Nationality:</span>{' '}
            {owner.nationality_other}
          </p>
        )}
      </div>

      <p className="mt-2">
        <span className="font-semibold">Legal Entity Type:</span>{' '}
        {legalEntityTypes[owner.legal_entity_type_code]?.description || 'N/A'}
      </p>
    </>
  )
}

export default function OwnerInfo({ owners }: OwnerInfoProps) {
  const ownershipHistory = getOwnershipHistory(owners)
  const [expandedOwners, setExpandedOwners] = useState<number[]>([])

  const toggleOwner = (index: number) => {
    setExpandedOwners(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Owner Information</h2>
      
      <div className="space-y-4">
        {ownershipHistory.map((owner, index) => {
          const isCurrentOwner = index === 0
          const isExpanded = isCurrentOwner || expandedOwners.includes(index)

          return (
            <div 
              key={`history-${index}`} 
              className={`p-4 rounded-md transition-colors ${
                isCurrentOwner ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => !isCurrentOwner && toggleOwner(index)}
              >
                <div>
                  <p className="font-semibold">{owner.party_name}</p>
                  {isCurrentOwner && (
                    <p className="text-sm text-green-600 font-medium mt-1">Current Owner</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600 block">
                    {partyTypes[owner.party_type]?.description || 'Unknown Type'}
                  </span>
                  {!isCurrentOwner && (
                    <span className="text-sm text-blue-600 mt-1 block">
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4">
                  <OwnerDetails owner={owner} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

