import React from 'react'

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
}

export default function Classifications({ classifications }: ClassificationsProps) {
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
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Status Date</th>
              <th className="py-2 px-4 text-left">First Use Anywhere</th>
              <th className="py-2 px-4 text-left">First Use in Commerce</th>
            </tr>
          </thead>
          <tbody>
            {classifications.map((classification, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                <td className="py-2 px-4">{classification.classification_status_code}</td>
                <td className="py-2 px-4">{formatDate(classification.classification_status_date)}</td>
                <td className="py-2 px-4">{formatDate(classification.first_use_anywhere_date)}</td>
                <td className="py-2 px-4">{formatDate(classification.first_use_in_commerce_date)}</td>
              </tr>
            ))}
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

