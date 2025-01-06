import React from 'react'

interface MarkInformationProps {
  caseData: {
    header: {
      mark_drawing_code: string
      standard_characters_claimed_in: boolean
      section_2f_in: boolean
      section_2f_in_part_in: boolean
      filing_date: string
    }
    statements: Array<{
      type_code: string
      statement_text: string
    }>
  }
}

export default function MarkInformation({ caseData }: MarkInformationProps) {
  const { header, statements } = caseData

  const getDrawingCodeDescription = (code: string) => {
    const firstDigit = code[0]
    switch (firstDigit) {
      case '1': return 'Typeset word(s)/letter(s)/number(s)'
      case '2': return 'Design without text'
      case '3': return 'Design with text'
      case '4': return 'Standard character mark'
      case '5': return 'Stylized text with design'
      case '6': return 'No drawing (e.g., sound)'
      default: return 'Not yet assigned'
    }
  }

  const getAcquiredDistinctiveness = () => {
    if (header.section_2f_in) return 'In whole'
    if (header.section_2f_in_part_in) return 'In part'
    return 'No'
  }

  const acquiredDistinctivenessStatements = statements.filter(statement => statement.type_code.startsWith('TF'))

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
        <p>
          <span className="font-semibold">Standard Character Claim:</span>{' '}
          {header.standard_characters_claimed_in ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="font-semibold">Acquired Distinctiveness Claim:</span>{' '}
          {getAcquiredDistinctiveness()}
        </p>
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

