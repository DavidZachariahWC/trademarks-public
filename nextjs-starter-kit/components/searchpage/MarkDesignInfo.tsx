import React from 'react'
import { Case } from '@/utils/types/case'
import InfoItem from '../shared/InfoItem'
import { formatDate, getDrawingCodeDescription } from '@/lib/utils'

interface MarkDesignInfoProps {
  caseData: Case
}

export default function MarkDesignInfo({ caseData }: MarkDesignInfoProps) {
  const { header, statements, design_searches } = caseData

  const markDescriptions = statements?.filter(statement => statement.type_code === 'DM0000') ?? []

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Mark Design Information</h2>
      <div className="space-y-4">
        <InfoItem
          label="Standard Character Claim"
          value={header.standard_characters_claimed_in ? 'Yes' : 'No'}
        />
        <div>
          <span className="font-semibold">Mark Drawing Type:</span>{' '}
          {header.mark_drawing_code}
          <span className="ml-2 text-gray-600">
            ({getDrawingCodeDescription(header.mark_drawing_code)})
          </span>
          {header.mark_drawing_code[0] === '4' && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Note:</span> Type 4 marks represent "Block letter drawing" if filed before Nov 2, 2003, 
              or "Standard Character Mark" if filed after.
              <div className="mt-1">
                This application filed: {header.filing_date ? formatDate(header.filing_date, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
            </div>
          )}
        </div>

        {markDescriptions.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Description of Mark</h3>
            {markDescriptions.map((description, index) => (
              <p key={index} className="mb-2">
                <span className="font-semibold">Text:</span> {description.statement_text}
              </p>
            ))}
          </div>
        )}

        {design_searches && design_searches.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Design Search Codes</h3>
            {design_searches.map((design, index) => (
              <p key={index} className="mb-1">
                <span className="font-semibold">Design Code:</span> {design.design_search_code}
              </p>
            ))}
          </div>
        )}

        <InfoItem
          label="Color Drawing (Current)"
          value={header.color_drawing_current_in ? 'Yes' : 'No'}
        />
        <InfoItem
          label="Color Drawing (Filed)"
          value={header.color_drawing_filed_in ? 'Yes' : 'No'}
        />
        <InfoItem
          label="3-D Drawing (Current)"
          value={header.drawing_3d_current_in ? 'Yes' : 'No'}
        />
        <InfoItem
          label="3-D Drawing (Filed)"
          value={header.drawing_3d_filed_in ? 'Yes' : 'No'}
        />
      </div>
    </div>
  )
}

