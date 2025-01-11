// SearchOptions.tsx
'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchOptionsProps {
  selectedOptions: Set<string>
  selectedBooleanOptions: Set<string>
  onOptionChange: (option: string, checked: boolean) => void
  onBooleanOptionChange: (option: string, checked: boolean) => void
}

const GENERAL_OPTIONS = [
  { id: 'wordmark', label: 'Word Mark' },
  { id: 'owner_name', label: "Owner's Name" },
  { id: 'attorney_name', label: 'Attorney Name' },
  { id: 'serial_number', label: 'Serial Number' },
  { id: 'registration_number', label: 'Registration Number' },
  { id: 'phonetic', label: 'Phonetic' },
  { id: 'disclaimer_statements', label: 'Disclaimer Statements' },
  { id: 'description_of_mark', label: 'Description of Mark' },
]

const DATE_OPTIONS = [
  { id: 'filing_date', label: 'Filing Date' },
  { id: 'registration_date', label: 'Registration Date' },
  { id: 'cancellation_date', label: 'Cancellation Date' },
  { id: 'foreign_filing_date', label: 'Foreign Filing Date' },
  { id: 'foreign_registration_date', label: 'Foreign Registration Date' },
  { id: 'int_reg_date', label: 'International Registration Date' },
  { id: 'int_pub_date', label: 'International Publication Date' },
  { id: 'auto_protection_date', label: 'Auto Protection Date' },
  { id: 'published_opposition_date', label: 'Published Opposition Date' },
  { id: 'renewal_date', label: 'Renewal Date' },
  { id: 'international_renewal_date', label: 'International Renewal Date' },
  { id: 'foreign_renewal_date', label: 'Foreign Renewal Date' },
]

const SECTION_8_OPTIONS = [
  { id: 'section_8_filed', label: 'Filed' },
  { id: 'section_8_partial_accept', label: 'Partially Accepted' },
  { id: 'section_8_accepted', label: 'Accepted' },
]

const SECTION_15_OPTIONS = [
  { id: 'section_15_filed', label: 'Filed' },
  { id: 'section_15_acknowledged', label: 'Acknowledged' },
]

const SECTION_12C_OPTIONS = [
  { id: 'section_12c', label: 'Filed' },
]

const FILING_STATUS_BOOLEAN_OPTIONS: { id: string, label: string }[] = []

const FILING_BASIS_OPTIONS = [
  { id: 'foreign_priority', label: 'Foreign Priority Claim (44(d))' },
  { id: 'foreign_registration', label: 'Foreign Registration (44(e))' },
  { id: 'extension_protection', label: 'Extension of Protection (66(a))' },
]

const CLASSIFICATION_OPTIONS = [
  { id: 'international_class', label: 'International Class' },
  { id: 'us_class', label: 'US Class' },
  { id: 'coordinated_class', label: 'Coordinated Class' },
]

const INTERNATIONAL_REGISTRATION_OPTIONS = [
  { id: 'int_reg_number', label: 'Registration Number' },
  { id: 'int_status_code', label: 'Status Code' },
  { id: 'priority_claimed', label: 'Priority Claimed' },
  { id: 'first_refusal', label: 'First Refusal' },
]

const OWNER_OPTIONS = [
  { id: 'owner_name', label: "Owner's Name" },
  { id: 'dba_name', label: 'DBA/AKA Name' },
  { id: 'name_change', label: 'Name Change' },
  { id: 'owner_legal_entity', label: 'Legal Entity Type' },
  { id: 'owner_party_type', label: 'Party Type' },
]

const VISUAL_CHARACTERISTICS_OPTIONS = [
  { id: 'drawing_code_type', label: 'Drawing Code' },
  { id: 'design_code', label: 'Design Code' },
  { id: 'color_drawing', label: 'Color Drawing' },
  { id: 'three_d_drawing', label: '3D Drawing' },
  { id: 'standard_character_claim', label: 'Standard Character Claim' },
]

const DRAWING_CODE_OPTIONS = [
  { value: '0', label: '0 - Not yet assigned' },
  { value: '1', label: '1 - Typeset word(s)/letter(s)/number(s)' },
  { value: '2', label: '2 - Design without text' },
  { value: '3', label: '3 - Design with text' },
  { value: '4', label: '4 - Standard character mark' },
  { value: '5', label: '5 - Stylized text with design' },
  { value: '6', label: '6 - No drawing (e.g., sound)' },
]

const ADDITIONAL_OPTIONS = [
  { id: 'prior_registration_present', label: 'Prior Registration Present' },
  { id: 'acquired_distinctiveness_whole', label: 'Acquired Distinctiveness (Whole)' },
  { id: 'acquired_distinctiveness_part', label: 'Acquired Distinctiveness (Part)' },
  { id: 'assignment_recorded', label: 'Assignment Recorded' },
]

export default function SearchOptions({
  selectedOptions,
  selectedBooleanOptions,
  onOptionChange,
  onBooleanOptionChange,
}: SearchOptionsProps) {
  const renderSection = (title: string, options: { id: string, label: string }[], isBoolean: boolean = false) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h3>
      <div className="space-y-3">
        {options.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
               onClick={() => isBoolean ? onBooleanOptionChange(id, !selectedBooleanOptions.has(id)) : onOptionChange(id, !selectedOptions.has(id))}>
            <Checkbox
              id={id}
              checked={isBoolean ? selectedBooleanOptions.has(id) : selectedOptions.has(id)}
              onCheckedChange={(checked) => 
                isBoolean 
                  ? onBooleanOptionChange(id, checked === true)
                  : onOptionChange(id, checked === true)
              }
              className="h-5 w-5"
            />
            <Label htmlFor={id} className="text-base cursor-pointer flex-1">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFilingStatusSection = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Filing Status</h3>
      
      {/* Section 8 Group */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Section 8</h4>
        <div className="space-y-3 pl-2">
          {SECTION_8_OPTIONS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                 onClick={() => onBooleanOptionChange(id, !selectedBooleanOptions.has(id))}>
              <Checkbox
                id={id}
                checked={selectedBooleanOptions.has(id)}
                onCheckedChange={(checked) => onBooleanOptionChange(id, checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor={id} className="text-base cursor-pointer flex-1">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Section 15 Group */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Section 15</h4>
        <div className="space-y-3 pl-2">
          {SECTION_15_OPTIONS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                 onClick={() => onBooleanOptionChange(id, !selectedBooleanOptions.has(id))}>
              <Checkbox
                id={id}
                checked={selectedBooleanOptions.has(id)}
                onCheckedChange={(checked) => onBooleanOptionChange(id, checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor={id} className="text-base cursor-pointer flex-1">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Section 12(c) Group */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Section 12(c)</h4>
        <div className="space-y-3 pl-2">
          {SECTION_12C_OPTIONS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                 onClick={() => onBooleanOptionChange(id, !selectedBooleanOptions.has(id))}>
              <Checkbox
                id={id}
                checked={selectedBooleanOptions.has(id)}
                onCheckedChange={(checked) => onBooleanOptionChange(id, checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor={id} className="text-base cursor-pointer flex-1">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Other Filing Status Options */}
      {FILING_STATUS_BOOLEAN_OPTIONS.length > 0 && (
        <div className="space-y-3">
          {FILING_STATUS_BOOLEAN_OPTIONS.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                 onClick={() => onBooleanOptionChange(id, !selectedBooleanOptions.has(id))}>
              <Checkbox
                id={id}
                checked={selectedBooleanOptions.has(id)}
                onCheckedChange={(checked) => onBooleanOptionChange(id, checked === true)}
                className="h-5 w-5"
              />
              <Label htmlFor={id} className="text-base cursor-pointer flex-1">
                {label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="py-6 px-2">
      {renderSection('General Search', GENERAL_OPTIONS)}
      {renderSection('Date Filters', DATE_OPTIONS)}
      {renderFilingStatusSection()}
      {renderSection('Filing Basis', FILING_BASIS_OPTIONS)}
      {renderSection('Classification', CLASSIFICATION_OPTIONS)}
      {renderSection('International Registration', INTERNATIONAL_REGISTRATION_OPTIONS)}
      {renderSection('Owner Information', OWNER_OPTIONS)}
      {renderSection('Visual Characteristics', VISUAL_CHARACTERISTICS_OPTIONS)}
      {renderSection('Additional Filters', ADDITIONAL_OPTIONS, true)}
    </div>
  )
}

