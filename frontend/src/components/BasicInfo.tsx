import React from 'react'

interface BasicInfoProps {
  caseData: any // Replace 'any' with a proper type definition
}

export default function BasicInfo({ caseData }: BasicInfoProps) {
  const {
    header,
    serial_number,
    registration_number
  } = caseData

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{header.mark_identification}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Serial Number" value={serial_number} />
        <InfoItem label="Registration Number" value={registration_number || 'N/A'} />
        <InfoItem label="Status" value={header.status_code || 'N/A'} />
        <InfoItem label="Filing Date" value={formatDate(header.filing_date)} />
        <InfoItem label="Registration Date" value={formatDate(header.registration_date)} />
        <InfoItem label="Date Cancelled" value={formatDate(header.cancellation_date)} />
        <InfoItem label="Published for Opposition" value={formatDate(header.published_for_opposition_date) || 'No'} />
        <InfoItem label="Attorney of Record" value={formatAttorneys(header.attorney_name)} />
        <InfoItem label="Republished 12c Date" value={formatDate(header.republished_12c_date)} />
        <InfoItem label="Section 8 Partial Accept" value={header.section_8_partial_accept_in ? 'Yes' : 'No'} />
        <InfoItem label="Section 8 Accepted" value={header.section_8_accepted_in ? 'Yes' : 'No'} />
        <InfoItem label="Section 15 Filed" value={header.section_15_filed_in ? 'Yes' : 'No'} />
        <InfoItem label="Section 15 Acknowledged" value={header.section_15_acknowledged_in ? 'Yes' : 'No'} />
        <InfoItem label="Changed Registration" value={header.change_registration_in ? 'Yes' : 'No'} />
        <InfoItem label="Concurrent Use" value={header.concurrent_use_in ? 'Yes' : 'No'} />
        <InfoItem label="Concurrent Use Proceeding Pending" value={header.concurrent_use_proceeding_in ? 'Yes' : 'No'} />
        <InfoItem label="Published for Concurrent Use" value={header.published_concurrent_in ? 'Yes' : 'No'} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Filing Basis Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BasisGroup
            title="Foreign Priority Claim (44(d))"
            items={[
              { label: "Filed as 44(d)", value: header.filing_basis_filed_as_44d_in },
              { label: "Amended to 44(d)", value: header.amended_to_44d_application_in },
              { label: "Currently 44(d)", value: header.filing_basis_current_44d_in },
            ]}
          />
          <BasisGroup
            title="Foreign Registration (44(e))"
            items={[
              { label: "Filed as 44(e)", value: header.filing_basis_filed_as_44e_in },
              { label: "Amended to 44(e)", value: header.amended_to_44e_application_in },
              { label: "Currently 44(e)", value: header.filing_basis_current_44e_in },
            ]}
          />
          <BasisGroup
            title="Extension of Protection (66(a))"
            items={[
              { label: "Filed as 66(a)", value: header.filing_basis_filed_as_66a_in },
              { label: "Currently 66(a)", value: header.filing_basis_current_66a_in },
            ]}
          />
          <BasisGroup
            title="Basis Issues"
            items={[
              { label: "No Current Basis", value: header.filing_current_no_basis_in },
              { label: "No Initial Basis", value: header.without_basis_currently_in },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <p className="mb-2">
      <span className="font-semibold text-gray-700">{label}:</span> {value}
    </p>
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

function formatDate(date: string | null): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

function formatAttorneys(attorneys: string | null): React.ReactNode {
  if (!attorneys) return 'N/A'
  return attorneys.split(';').map((attorney, index) => (
    <React.Fragment key={index}>
      {index > 0 && '; '}
      <a
        href={`/?attorney=${encodeURIComponent(attorney.trim())}`}
        className="text-blue-600 hover:underline"
      >
        {attorney.trim()}
      </a>
    </React.Fragment>
  ))
}

