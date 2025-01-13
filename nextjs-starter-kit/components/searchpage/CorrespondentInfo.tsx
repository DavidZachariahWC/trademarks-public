import React from 'react'
import { Correspondent } from '../types/case'

interface CorrespondentInfoProps {
  correspondents: Correspondent[]
}

export default function CorrespondentInfo({ correspondents }: CorrespondentInfoProps) {
  if (!correspondents || correspondents.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Correspondent Information</h2>
      <div className="space-y-6">
        {correspondents.map((correspondent, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            {correspondent.address_1 && <p>{correspondent.address_1}</p>}
            {correspondent.address_2 && <p>{correspondent.address_2}</p>}
            {correspondent.address_3 && <p>{correspondent.address_3}</p>}
            {correspondent.address_4 && <p>{correspondent.address_4}</p>}
            {correspondent.address_5 && <p>{correspondent.address_5}</p>}
            {index < correspondents.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
} 