import React from 'react'
import { formatDate } from '@/utils/format'
import type { InternationalRegistration as IntlReg } from '@/types/case'

interface InternationalRegistrationProps {
  registrations: IntlReg[]
}

export default function InternationalRegistration({ registrations }: InternationalRegistrationProps) {
  if (!registrations || registrations.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">International Registration</h2>
      <div className="space-y-6">
        {registrations.map((reg, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <InfoItem label="Registration Number" value={reg.international_registration_number} />
            <InfoItem label="Registration Date" value={formatDate(reg.international_registration_date)} />
            <InfoItem label="Publication Date" value={formatDate(reg.international_publication_date)} />
            <InfoItem label="Auto Protection Date" value={formatDate(reg.auto_protection_date)} />
            <InfoItem label="Status Code" value={reg.international_status_code} />
            <InfoItem label="Status Date" value={formatDate(reg.international_status_date)} />
            <InfoItem label="Renewal Date" value={formatDate(reg.international_renewal_date)} />
            <InfoItem label="Death Date" value={formatDate(reg.international_death_date)} />
            <div className="mt-2">
              <span className="font-semibold">Priority Claimed:</span>{' '}
              <span className={`px-2 py-1 rounded ${reg.priority_claimed_in ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {reg.priority_claimed_in ? 'Yes' : 'No'}
              </span>
            </div>
            {reg.priority_claimed_in && (
              <InfoItem label="Priority Claimed Date" value={formatDate(reg.priority_claimed_date)} />
            )}
            <div className="mt-2">
              <span className="font-semibold">First Refusal:</span>{' '}
              <span className={`px-2 py-1 rounded ${reg.first_refusal_in ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {reg.first_refusal_in ? 'Yes' : 'No'}
              </span>
            </div>
            {reg.first_refusal_in && (
              <InfoItem label="Notification Date" value={formatDate(reg.notification_date)} />
            )}
            {index < registrations.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
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

