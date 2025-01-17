import React from 'react'
import { Case } from '@/utils/types/case'
import { formatDate, getDrawingCodeDescription, getAcquiredDistinctiveness } from '@/lib/utils'
import { getDesignCodeDescription, getCategoryDescription, getDivisionDescription } from '@/utils/constants/designCodes'

// Helper function to format design code with decimal points
const formatDesignCode = (code: string): string => {
  if (code.length !== 6) return code;
  return `${code.slice(0, 2)}.${code.slice(2, 4)}.${code.slice(4, 6)}`;
}

interface InfoItemProps {
  label: string
  value: string | null | boolean
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-semibold text-gray-700">{label}:</span>{' '}
    <span className="text-gray-900">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}</span>
  </div>
)

interface StatementSectionProps {
  title: string
  statements: Array<{ statement_text: string }>
}

const StatementSection: React.FC<StatementSectionProps> = ({ title, statements }) => {
  if (!statements || statements.length === 0) return null;
  
  return (
    <div className="mb-6 bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {statements.map((statement, index) => (
          <p key={index} className="text-gray-700 bg-white rounded p-3 shadow-sm">
            {statement.statement_text}
          </p>
        ))}
      </div>
    </div>
  );
};

interface MarkDesignInfoProps {
  caseData: Case
}

export default function MarkDesignInfo({ caseData }: MarkDesignInfoProps) {
  const { header, statements, design_searches } = caseData

  // Filter statements by their type codes
  const markDescriptions = statements?.filter(statement => statement.type_code === 'DM0000') || []
  const colorsClaimed = statements?.filter(statement => statement.type_code === 'CC0000') || []
  const colorsDescription = statements?.filter(statement => statement.type_code === 'CD0000') || []
  const liningStippling = statements?.filter(statement => statement.type_code === 'LS0000') || []
  const disclaimers = statements?.filter(statement => statement.type_code === 'DS0000') || []
  const acquiredDistinctivenessStatements = statements?.filter(statement => statement.type_code.startsWith('TF')) ?? []

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Mark Design Information</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <InfoItem
            label="Standard Character Claim"
            value={header.standard_characters_claimed_in ? 'Yes' : 'No'}
          />
          <div>
            <span className="font-semibold text-gray-700">Mark Drawing Type:</span>{' '}
            {header.mark_drawing_code}
            <span className="ml-2 text-gray-600">
              ({getDrawingCodeDescription(header.mark_drawing_code)})
            </span>
          </div>
          {header.mark_drawing_code[0] === '4' && (
            <div className="md:col-span-2 mt-2 text-sm text-gray-600">
              <span className="font-semibold">Note:</span> Type 4 marks represent "Block letter drawing" if filed before Nov 2, 2003, 
              or "Standard Character Mark" if filed after.
              <div className="mt-1">
                This application filed: {header.filing_date ? formatDate(header.filing_date, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <InfoItem
            label="Acquired Distinctiveness Claim"
            value={getAcquiredDistinctiveness(header.section_2f_in, header.section_2f_in_part_in)}
          />
          {header.section_2f_in_part_in && acquiredDistinctivenessStatements.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Acquired Distinctiveness Statement</h3>
              <div className="space-y-2">
                {acquiredDistinctivenessStatements.map((statement, index) => (
                  <p key={index} className="bg-white rounded p-3 text-gray-700 shadow-sm">
                    {statement.statement_text}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <StatementSection title="Description of Mark" statements={markDescriptions} />
            <StatementSection title="Color(s) Claimed" statements={colorsClaimed} />
            <StatementSection title="Color(s) Description" statements={colorsDescription} />
            <StatementSection title="Lining and Stippling Statement" statements={liningStippling} />
          </div>
          <div className="space-y-6">
            <StatementSection title="Disclaimer Statement" statements={disclaimers} />
          </div>
        </div>

        {design_searches && design_searches.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="text-xl font-semibold p-4 bg-gray-50 border-b border-gray-200">Design Search Codes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Design Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Section Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {design_searches.map((design, index) => {
                    const formattedCode = formatDesignCode(design.design_search_code);
                    const [categoryCode, divisionCode] = formattedCode.split('.');
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">{formattedCode}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                          {getCategoryDescription(categoryCode)}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                          {getDivisionDescription(categoryCode, divisionCode)}
                        </td>
                        <td className="px-6 py-4 whitespace-normal">
                          <span className="text-sm font-bold text-gray-900">{getDesignCodeDescription(formattedCode)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
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
    </div>
  )
}

