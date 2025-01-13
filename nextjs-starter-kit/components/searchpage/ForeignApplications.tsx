import React from 'react'

interface ForeignApplication {
  foreign_country: string
  foreign_other?: string
  application_number: string | null
  foreign_registration_number: string | null
  foreign_filing_date: string | null
  foreign_registration_date: string | null
  registration_expiration_date: string | null
  registration_renewal_date: string | null
  renewal_number: string | null
  registration_renewal_expiration_date: string | null
  foreign_priority_claim_in: boolean
}

interface ForeignApplicationsProps {
  foreignApplications: ForeignApplication[]
}

export default function ForeignApplications({ foreignApplications }: ForeignApplicationsProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Foreign Applications</h2>
      {foreignApplications.length > 0 ? (
        <div className="space-y-6">
          {foreignApplications.map((app, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <p>
                <span className="font-semibold">Country:</span>{' '}
                {app.foreign_country}
                {app.foreign_other && ` (${app.foreign_other})`}
              </p>
              <InfoItem label="Application Number" value={app.application_number} />
              <InfoItem label="Registration Number" value={app.foreign_registration_number} />
              <InfoItem label="Filing Date" value={formatDate(app.foreign_filing_date)} />
              <InfoItem label="Registration Date" value={formatDate(app.foreign_registration_date)} />
              <InfoItem label="Registration Expiration" value={formatDate(app.registration_expiration_date)} />
              <InfoItem label="Renewal Date" value={formatDate(app.registration_renewal_date)} />
              <InfoItem label="Renewal Number" value={app.renewal_number} />
              <InfoItem label="Renewal Expiration" value={formatDate(app.registration_renewal_expiration_date)} />
              <p>
                <span className="font-semibold">Priority Claim:</span>{' '}
                <span className={`px-2 py-1 rounded ${app.foreign_priority_claim_in ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {app.foreign_priority_claim_in ? 'Yes' : 'No'}
                </span>
              </p>
              {index < foreignApplications.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}
        </div>
      ) : (
        <p>No foreign applications found.</p>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <p className="mb-2">
      <span className="font-semibold">{label}:</span> {value || 'N/A'}
    </p>
  )
}

function formatDate(date: string | null): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

