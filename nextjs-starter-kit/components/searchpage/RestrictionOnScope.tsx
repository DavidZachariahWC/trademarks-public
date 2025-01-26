import React from 'react'
import { Statement } from '@/utils/types/case'

interface RestrictionOnScopeProps {
  statements?: Statement[]
}

function getStatementDescription(statement: Statement): string {
  // Extract year (positions 3-4)
  const yearDigits = statement.type_code.substring(2, 4);
  // Extract month (positions 5-6)
  const monthDigits = statement.type_code.substring(4, 6);
  
  // Convert month number to month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = parseInt(monthDigits, 10) - 1;
  const monthName = monthNames[monthIndex] || monthDigits;

  // Determine century (assuming 20th or 21st century based on year digits)
  const fullYear = parseInt(yearDigits) > 50 ? `19${yearDigits}` : `20${yearDigits}`;
  
  return `Entry Date: ${monthName} ${fullYear}`;
}

export default function RestrictionOnScope({ statements }: RestrictionOnScopeProps) {
  if (!statements) return null;

  const restrictionStatements = statements.filter(stmt => 
    stmt.type_code && stmt.type_code.startsWith('OR')
  );

  if (restrictionStatements.length === 0) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Restriction on Scope or Claim of Registration</h2>
      <div className="space-y-6">
        {restrictionStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="font-semibold text-gray-700 mb-2">
              {getStatementDescription(statement)}
            </div>
            <div className="text-gray-600 whitespace-pre-wrap">
              {statement.statement_text}
            </div>
            {index < restrictionStatements.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
} 