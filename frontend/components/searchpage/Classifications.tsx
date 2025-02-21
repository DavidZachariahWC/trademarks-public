import React from 'react'
import { getClassificationStatusDescription } from '@/utils/constants/classificationStatusCodes'

interface Classification {
  international_code: string
  us_code: string
  primary_code: string
  classification_status_code: string
  classification_status_date: string | null
  first_use_anywhere_date: string | null
  first_use_in_commerce_date: string | null
}

interface ClassificationsProps {
  classifications: Classification[]
  statements?: Array<{ type_code: string, statement_text: string }>
}

function getStatusClassName(statusCode: string): string {
  if (statusCode === '6') {
    return 'inline-block bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 leading-normal';
  }
  if (['A', 'B', 'C', 'D', 'E'].includes(statusCode)) {
    return 'inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-3 py-1 leading-normal';
  }
  if (statusCode === '9') {
    return 'inline-block bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 leading-normal';
  }
  return 'inline-block text-gray-700 border border-gray-200 rounded-full px-3 py-1 leading-normal';
}

function padClassNumber(classNumber: string | null | undefined): string {
  if (!classNumber) return '';
  return classNumber.toString().padStart(3, '0');
}

export default function Classifications({ classifications, statements = [] }: ClassificationsProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Classifications</h2>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="font-semibold mb-2">Note: The following symbols indicate amendments to goods/services:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="bg-gray-200 px-1 rounded">[...]</code> - Deleted goods/services</li>
          <li><code className="bg-gray-200 px-1 rounded">((...))</code> - Goods/services not claimed in Section 15 affidavit of incontestability</li>
          <li><code className="bg-gray-200 px-1 rounded">*...*</code> - Additional (new) wording in goods/services</li>
        </ul>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">International Class</th>
              <th className="py-2 px-4 text-left">US Class</th>
              <th className="py-2 px-4 text-left min-w-[300px]">Status</th>
              <th className="py-2 px-4 text-left">Status Date</th>
              <th className="py-2 px-4 text-left">First Use Anywhere</th>
              <th className="py-2 px-4 text-left">First Use in Commerce</th>
            </tr>
          </thead>
          <tbody>
            {classifications.map((classification, index) => {
              const paddedClass = padClassNumber(classification.international_code);
              const paddedUSClass = padClassNumber(classification.us_code);
              const matchingStatements = statements
                ?.filter(stmt => 
                  stmt.type_code.startsWith('GS') && 
                  (stmt.type_code.substring(2, 5) === paddedClass || 
                   stmt.type_code.substring(2, 5) === paddedUSClass)
                ) || [];

              const hasStatement = matchingStatements.length > 0;

              return (
                <React.Fragment key={index}>
                  {hasStatement && (
                    <>
                      {index > 0 && (
                        <tr>
                          <td colSpan={6} className="h-12" style={{
                            background: 'linear-gradient(45deg, #f9fafb 25%, #f3f4f6 25%, #f3f4f6 50%, #f9fafb 50%, #f9fafb 75%, #f3f4f6 75%)',
                            backgroundSize: '20px 20px'
                          }}></td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={6} className="py-4 px-8 bg-blue-50 border-t border-b border-blue-100">
                          <div className="text-sm">
                            {matchingStatements.map((stmt, stmtIndex) => (
                              <p key={stmtIndex} className="mb-1 font-bold text-gray-800">
                                {stmt.statement_text}
                              </p>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-4">
                      {classification.international_code}
                      {classification.primary_code === classification.international_code && (
                        <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">Primary</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {classification.us_code}
                      {classification.primary_code === classification.us_code && (
                        <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">Primary</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start">
                        <span className={getStatusClassName(classification.classification_status_code)}>
                          {getClassificationStatusDescription(classification.classification_status_code)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">{formatDate(classification.classification_status_date)}</td>
                    <td className="py-2 px-4">{formatDate(classification.first_use_anywhere_date)}</td>
                    <td className="py-2 px-4">{formatDate(classification.first_use_in_commerce_date)}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(date: string | null): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

