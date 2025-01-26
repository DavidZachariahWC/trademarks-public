import React from 'react'

interface Statement {
  type_code: string
  statement_text: string
}

interface GoodsServicesStatementsProps {
  statements: Statement[]
}

export default function GoodsServicesStatements({ statements }: GoodsServicesStatementsProps) {
  const goodsServicesStatements = statements.filter(statement => statement.type_code.startsWith('GS'))

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Goods and Services Statements</h2>
      <div className="space-y-4">
        {goodsServicesStatements.map((statement, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Type Code: {statement.type_code}</h3>
            <p className="whitespace-pre-wrap">{statement.statement_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

