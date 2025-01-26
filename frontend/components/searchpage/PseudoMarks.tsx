import React from 'react'
import { Statement } from '@/utils/types/case'

interface PseudoMarksProps {
  statements?: Statement[]
}

export default function PseudoMarks({ statements }: PseudoMarksProps) {
  if (!statements) return null;

  const pseudoMarkStatements = statements.filter(stmt => 
    stmt.type_code && stmt.type_code.startsWith('PM')
  );

  if (pseudoMarkStatements.length === 0) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Pseudo Marks</h2>
      <div className="space-y-4">
        {pseudoMarkStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="text-gray-600 whitespace-pre-wrap">
              {statement.statement_text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 