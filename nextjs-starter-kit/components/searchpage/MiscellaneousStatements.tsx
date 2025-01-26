import React from 'react'
import { Statement } from '@/utils/types/case'

interface MiscellaneousStatementsProps {
  statements?: Statement[]
}

const STATEMENT_TYPES: Record<string, string> = {
  'AF': 'In another form statement',
  'A0': 'Amendment to a Registration/Renewal Certificate',
  'B0': 'Certificate of Correction for a Registration',
  'IN': 'Interference Statement',
  'MK': 'Workmark Overflow',
  'NR': 'Non Registration Information',
  'N0': 'Name/Portrait Description and/or Consent Statement',
  'TR': 'Translation of Words in Mark',
  'TLIT': 'Transliteration Statement',
  'TNSF': 'Transformation Information',
  'LINKBR': 'Linkage Information'
}

function getStatementDescription(statement: Statement): string {
  // For exact match of LINKBR
  if (statement.type_code === 'LINKBR') {
    return STATEMENT_TYPES['LINKBR'];
  }

  // For TLIT and TNSF, we need to check first 4 positions
  if (statement.type_code.startsWith('TLIT') || statement.type_code.startsWith('TNSF')) {
    return STATEMENT_TYPES[statement.type_code.substring(0, 4)];
  }

  // For other cases, check first 2 positions as before
  const prefix = statement.type_code.substring(0, 2);
  const baseDescription = STATEMENT_TYPES[prefix];
  
  if (!baseDescription) return '';

  const parts: string[] = [baseDescription];

  if (prefix === 'AF') {
    // Extract prime class (positions 3-5)
    const primeClass = statement.type_code.substring(2, 5);
    if (primeClass && primeClass !== '000') {
      parts.push(`Prime Class: ${primeClass}`);
    }

    // Extract usage indicator (position 6)
    const usageIndicator = statement.type_code.charAt(5);
    switch (usageIndicator) {
      case '0':
        parts.push('(Applies to both first use dates)');
        break;
      case '1':
        parts.push('(Applies to first use date only)');
        break;
      case '2':
        parts.push('(Applies to first use in Commerce only)');
        break;
    }
  } else if (prefix === 'A0' || prefix === 'B0') {
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
    
    parts.push(`Entry Date: ${monthName} ${fullYear}`);
  }

  return parts.join(' - ');
}

export default function MiscellaneousStatements({ statements }: MiscellaneousStatementsProps) {
  if (!statements) return null;

  const miscStatements = statements.filter(stmt => {
    if (!stmt.type_code) return false;
    
    // Check exact match for LINKBR
    if (stmt.type_code === 'LINKBR') {
      return true;
    }
    
    // Check 4-character prefixes
    if (stmt.type_code.startsWith('TLIT') || stmt.type_code.startsWith('TNSF')) {
      return true;
    }
    
    // Then check 2-character prefixes
    const prefix = stmt.type_code.substring(0, 2);
    return Object.keys(STATEMENT_TYPES)
      .filter(key => key.length === 2) // Only consider 2-char keys
      .some(key => prefix === key);
  });

  if (miscStatements.length === 0) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Miscellaneous Statements</h2>
      <div className="space-y-6">
        {miscStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="font-semibold text-gray-700 mb-2">
              {getStatementDescription(statement)}
            </div>
            <div className="text-gray-600 whitespace-pre-wrap">
              {statement.statement_text}
            </div>
            {index < miscStatements.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  )
} 