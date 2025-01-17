// BasicInfo.tsx
import React from 'react'
import { Case } from '@/utils/types/case'
import { formatDate, formatAttorneys } from '@/lib/utils'
import { statusCodes } from '@/utils/constants/statusCodes'
import * as Tooltip from '@radix-ui/react-tooltip'
import Link from 'next/link'

interface BasicInfoProps {
  caseData: Case
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

const determineRegisterType = (header: Case['header']) => {
  if (header.supplemental_register_in) return 'Supplemental Register'
  return 'Principal Register'
}

export default function BasicInfo({ caseData }: BasicInfoProps) {
  const {
    header,
    serial_number,
    registration_number
  } = caseData

  const registerType = determineRegisterType(header)
  const statusCode = header.status_code || 'N/A'
  const statusInfo = statusCodes[statusCode]

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{header.mark_identification}</h2>
      
      <div className={`mb-6 p-4 rounded-lg ${
        statusInfo?.status === 'Live' ? 'bg-green-50' : 
        statusInfo?.status === 'Dead' ? 'bg-red-50' : 
        'bg-gray-50'
      }`}>
        <div>
          <span className="font-semibold text-gray-700">Status Code:</span>{' '}
          <span className="text-gray-900">{statusCode} - {statusInfo?.description || 'Unknown Status'}</span>
        </div>
        <div className="mt-2">
          <span className="font-semibold text-gray-700">Status Date:</span>{' '}
          <span className="text-gray-900">{formatDate(header.status_date) || 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="US Serial Number" value={serial_number} />
        <InfoItem label="US Registration Number" value={registration_number || 'N/A'} />
        <InfoItem 
          label="Mark Type" 
          value={(() => {
            if (header.certification_mark_in) {
              return 'Certification Mark';
            }
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

        <div className="col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger className="cursor-help">
                    <InfoItem label="Filing Date" value={formatDate(header.filing_date)} />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
                      sideOffset={5}
                    >
                      The date on which the trademark application was filed with the USPTO
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <div>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger className="cursor-help">
                    <InfoItem label="Registration Date" value={formatDate(header.registration_date)} />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
                      sideOffset={5}
                    >
                      The date on which the trademark is officially registered by the USPTO
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <div>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger className="cursor-help">
                    <InfoItem label="Publication Date" value={formatDate(header.published_for_opposition_date) || 'No'} />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
                      sideOffset={5}
                    >
                      The date on which the trademark is published in the Official Gazette
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <InfoItem label="Date Cancelled" value={formatDate(header.cancellation_date)} />
          </div>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Attorney of Record:</span>{' '}
          {header.attorney_name ? (
            <Link 
              href={`/attorney-lookup?q=${encodeURIComponent(header.attorney_name)}`}
              className="text-blue-600 hover:underline cursor-help"
              title="Click to see all cases by this attorney"
            >
              {formatAttorneys(header.attorney_name)}
            </Link>
          ) : (
            <span className="text-gray-900">N/A</span>
          )}
        </div>
        <InfoItem label="Change Registration" value={header.change_registration_in ? 'Yes' : 'No'} />
      </div>

      <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <BasisGroup
              title="Filing Basis (44d)"
              items={[
                { 
                  label: 'Filed As', 
                  value: header.filing_basis_filed_as_44d_in,
                  tooltip: 'Determines if this application contained a claim based on foreign filing priority under Section 44(d) at the time of initial filing'
                },
                { 
                  label: 'Amended To Include', 
                  value: header.amended_to_44d_application_in,
                  tooltip: 'Determines if this application was amended after filing to add a claim based on foreign filing priority under Section 44(d)'
                },
                { 
                  label: 'Current', 
                  value: header.filing_basis_current_44d_in,
                  tooltip: 'Determines if this application currently contains a claim based on foreign filing priority under Section 44(d)'
                }
              ]}
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <BasisGroup
              title="Filing Basis (44e)"
              items={[
                { 
                  label: 'Filed As', 
                  value: header.filing_basis_filed_as_44e_in,
                  tooltip: 'Determines if this application contained a claim based on foreign registration under Section 44(e) at the time of initial filing'
                },
                { 
                  label: 'Amended To Include', 
                  value: header.amended_to_44e_application_in,
                  tooltip: 'Determines if this application was amended after filing to add a claim based on foreign registration under Section 44(e)'
                },
                { 
                  label: 'Current', 
                  value: header.filing_basis_current_44e_in,
                  tooltip: 'Determines if this application currently contains a claim based on foreign registration under Section 44(e)'
                }
              ]}
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <BasisGroup
              title="Filing Basis (66a)"
              items={[
                { 
                  label: 'Filed As', 
                  value: header.filing_basis_filed_as_66a_in,
                  tooltip: 'Determines if this application contained a Request for Extension of Protection in the US under Section 66(a) at the time of filing'
                },
                { 
                  label: 'Current', 
                  value: header.filing_basis_current_66a_in,
                  tooltip: 'Determines if this application currently contains a Request for Extension of Protection in the US under Section 66(a)'
                }
              ]}
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <BasisGroup
              title="No Basis Status"
              items={[
                { 
                  label: 'Current No Basis', 
                  value: header.filing_current_no_basis_in,
                  tooltip: 'Determines if this application currently has no valid filing basis'
                },
                { 
                  label: 'Without Basis Currently', 
                  value: header.without_basis_currently_in,
                  tooltip: 'Determines if this application is currently without any filing basis'
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface BasisGroupProps {
  title: string
  items: Array<{
    label: string
    value: boolean
    tooltip?: string
  }>
}

const BasisGroup: React.FC<BasisGroupProps> = ({ title, items }) => (
  <div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.tooltip ? (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger className="cursor-help mr-2 text-gray-700">
                  {item.label}:
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
                    sideOffset={5}
                  >
                    {item.tooltip}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <span className="mr-2 text-gray-700">{item.label}:</span>
          )}
          <span>{item.value ? 'Yes' : 'No'}</span>
        </div>
      ))}
    </div>
  </div>
)

