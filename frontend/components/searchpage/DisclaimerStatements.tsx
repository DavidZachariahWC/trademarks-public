import React from 'react'

interface Statement {
  type_code: string
  statement_text: string
}

interface DisclaimerStatementsProps {
  statements: Statement[]
}

export default function DisclaimerStatements({ statements }: DisclaimerStatementsProps) {
  const disclaimerStatements = statements.filter(statement => 
    statement.type_code === 'D00000' || statement.type_code === 'D10000'
  )

  if (disclaimerStatements.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Disclaimer Statements</h2>
      <div className="space-y-4">
        {disclaimerStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <p className="font-semibold mb-2">
              Type: {statement.type_code === 'D00000' ? 'Disclaimer Statement (D00000)' : 'Disclaimer Statement (D10000)'}
            </p>
            <p><span className="font-semibold">Text:</span> {statement.statement_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

