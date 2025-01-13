// BasicInfo.tsx
import React from 'react'
import { formatDate, formatAttorneys } from '@/lib/utils'
import InfoItem from '../shared/InfoItem'

interface BasicInfoProps {
  caseData: any // Replace 'any' with a proper type definition
}

function determineRegisterType(header: any): string {
  if (header.supplemental_register_in) {
    return 'Supplemental Register'
  }
  
  if (header.section_2f_in) {
    return 'Principal Register (Section 2(f))'
  }
  
  if (header.section_2f_in_part_in) {
    return 'Principal Register (Section 2(f) in part)'
  }
  
  return 'Principal Register'
}

export default function BasicInfo({ caseData }: BasicInfoProps) {
  const {
    header,
    serial_number,
    registration_number
  } = caseData

  const registerType = determineRegisterType(header)

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{header.mark_identification}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="US Serial Number" value={serial_number} />
        <InfoItem label="US Registration Number" value={registration_number || 'N/A'} />
        <InfoItem 
          label="Mark Type" 
          value={(() => {
            // Certification mark must appear alone
            if (header.certification_mark_in) {
              return 'Certification Mark';
            }
            
            // Collect all other active mark types
            const types = [];
            if (header.trademark_in) types.push('Trademark');
            if (header.service_mark_in) types.push('Service Mark');
            if (header.collective_trademark_in) types.push('Collective Trademark');
            if (header.collective_service_mark_in) types.push('Collective Service Mark');
            if (header.collective_membership_mark_in) types.push('Collective Membership Mark');
            
            return types.length > 0 ? types.join(' and ') : 'N/A';
          })()} 
        />
        <InfoItem label="Register" value={registerType} />
        <InfoItem label="Status" value={header.status_code || 'N/A'} />
        <InfoItem label="Status Date" value={formatDate(header.status_date)} />
        <InfoItem label="Filing Date" value={formatDate(header.filing_date)} />
        <InfoItem label="Registration Date" value={formatDate(header.registration_date)} />
        <InfoItem label="Date Cancelled" value={formatDate(header.cancellation_date)} />
        <InfoItem label="Publication Date" value={formatDate(header.published_for_opposition_date) || 'No'} />
        <InfoItem label="Attorney of Record" value={formatAttorneys(header.attorney_name)} />
        <InfoItem label="Change Registration" value={header.change_registration_in ? 'Yes' : 'No'} />
        <InfoItem label="Concurrent Use" value={header.concurrent_use_in ? 'Yes' : 'No'} />
        <InfoItem label="Concurrent Use Proceeding" value={header.concurrent_use_proceeding_in ? 'Yes' : 'No'} />
        <InfoItem label="Published Concurrent" value={header.published_concurrent_in ? 'Yes' : 'No'} />
      </div>

      <div className="mt-6 space-y-4">
        <BasisGroup
          title="Filing Basis (44d)"
          items={[
            { label: 'Filed As', value: header.filing_basis_filed_as_44d_in },
            { label: 'Amended To', value: header.amended_to_44d_application_in },
            { label: 'Current', value: header.filing_basis_current_44d_in }
          ]}
        />

        <BasisGroup
          title="Filing Basis (44e)"
          items={[
            { label: 'Filed As', value: header.filing_basis_filed_as_44e_in },
            { label: 'Amended To', value: header.amended_to_44e_application_in },
            { label: 'Current', value: header.filing_basis_current_44e_in }
          ]}
        />

        <BasisGroup
          title="Filing Basis (66a)"
          items={[
            { label: 'Filed As', value: header.filing_basis_filed_as_66a_in },
            { label: 'Current', value: header.filing_basis_current_66a_in }
          ]}
        />

        <BasisGroup
          title="No Basis Status"
          items={[
            { label: 'Current No Basis', value: header.filing_current_no_basis_in },
            { label: 'Without Basis Currently', value: header.without_basis_currently_in }
          ]}
        />
      </div>
    </div>
  )
}

function BasisGroup({ title, items }: { title: string; items: { label: string; value: boolean }[] }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h4 className="font-semibold mb-2">{title}</h4>
      {items.map((item, index) => (
        <p key={index} className="text-sm">
          <span className="text-gray-600">{item.label}:</span> {item.value ? 'Yes' : 'No'}
        </p>
      ))}
    </div>
  )
}

