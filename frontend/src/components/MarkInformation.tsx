import React from 'react'
import { Case } from '../types/case'
import InfoItem from './shared/InfoItem'
import { getDrawingCodeDescription, getAcquiredDistinctiveness } from '../utils/format'

interface MarkInformationProps {
  caseData: Case
}

export default function MarkInformation({ caseData }: MarkInformationProps) {
  const { header, statements } = caseData

  const acquiredDistinctivenessStatements = statements?.filter(statement => statement.type_code.startsWith('TF')) ?? []

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Mark Information</h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Mark Drawing Type:</span>{' '}
          {header.mark_drawing_code}
          <span className="ml-2 text-gray-600">
            ({getDrawingCodeDescription(header.mark_drawing_code)})
          </span>
        </div>
        
        <InfoItem
          label="Standard Character Claim"
          value={header.standard_characters_claimed_in ? 'Yes' : 'No'}
        />
        
        <InfoItem
          label="Acquired Distinctiveness Claim"
          value={getAcquiredDistinctiveness(header.section_2f_in, header.section_2f_in_part_in)}
        />
        
        {header.section_2f_in_part_in && acquiredDistinctivenessStatements.length > 0 && (
          <div>
            <p className="font-semibold">Acquired Distinctiveness Statement:</p>
            {acquiredDistinctivenessStatements.map((statement, index) => (
              <p key={index} className="mt-2 pl-4 border-l-2 border-gray-300">
                {statement.statement_text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

