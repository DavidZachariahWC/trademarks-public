// SearchOptions.tsx
'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchOptionsProps {
  onSelect: (strategy: string, group: string, label: string) => void;
  onClose?: () => void;
  booleanStrategies: Set<string>;
}

const GENERAL_OPTIONS = [
  { id: 'wordmark', label: 'Wordmark' },
  // { id: 'phonetic', label: 'Phonetic' },  // Temporarily disabled
  { id: 'description_of_mark', label: 'Description of Mark' },
  { id: 'pseudo_mark', label: 'Pseudo Mark' },
  { id: 'owner_name', label: "Owner's Name" },
  { id: 'attorney_name', label: 'Attorney Name' },
  { id: 'serial_number', label: 'Serial Number' },
  { id: 'registration_number', label: 'Registration Number' },
  { id: 'disclaimer_statements', label: 'Disclaimer Statements' },
]

const CLASSIFICATION_OPTIONS = [
  { id: 'international_class', label: 'International Class' },
  { id: 'us_class', label: 'US Class' },
  { id: 'coordinated_class', label: 'Coordinated Class' },
]

const VISUAL_CHARACTERISTICS_OPTIONS = [
  { id: 'drawing_code_type', label: 'Drawing Code' },
  { id: 'design_code', label: 'Design Code' },
  { id: 'color_drawing', label: 'Color Drawing' },
  { id: 'three_d_drawing', label: '3-D Drawing' },
  { id: 'standard_character_claim', label: 'Standard Character Claim' },
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

const OWNER_OPTIONS = [
  { id: 'owner_name', label: "Owner's Name" },
  { id: 'dba_name', label: 'DBA/AKA Name' },
  { id: 'name_change', label: 'Name Change' },
  { id: 'owner_legal_entity', label: 'Legal Entity Type' },
  { id: 'owner_party_type', label: 'Party Type' },
]

const FILING_STATUS_OPTIONS = [
  { id: 'section_12c', label: 'Section 12c Filed' },
  { id: 'section_8', label: 'Section 8 Filed' },
  { id: 'section_15', label: 'Section 15 Filed' },
  { id: 'change_registration', label: 'Changed Registration' },
  { id: 'concurrent_use', label: 'Concurrent Use' },
  { id: 'concurrent_use_proceeding', label: 'Concurrent Use Proceeding Pending' },
  { id: 'assignment_recorded', label: 'Assignment Recorded' },
]

const FILING_BASIS_OPTIONS = [
  { id: 'foreign_priority', label: 'Foreign Priority Claim (44(d))' },
  { id: 'foreign_registration', label: 'Foreign Registration (44(e))' },
  { id: 'extension_protection', label: 'Extension of Protection (66(a))' },
  { id: 'no_current_basis', label: 'No Current Basis' },
  { id: 'no_initial_basis', label: 'No Initial Basis' },
  { id: 'intent_to_use', label: 'Intent to Use' },
  { id: 'actual_use', label: 'Actual Use' },
  { id: 'foreign_application', label: 'Foreign Application' },
]

const REGISTRATION_TYPE_OPTIONS = [
  { id: 'certification_mark', label: 'Certification Mark' },
  { id: 'collective_membership_mark', label: 'Collective Membership Mark' },
  { id: 'collective_trademark', label: 'Collective Trademark' },
  { id: 'collective_service_mark', label: 'Collective Service Mark' },
  { id: 'trademark', label: 'Trademark' },
  { id: 'service_mark', label: 'Service Mark' },
]

const REGISTER_TYPE_OPTIONS = [
  { id: 'supplemental_register', label: 'Supplemental Register' },
  { id: 'principal_register', label: 'Principal Register' },
]

const APPLICATION_STATUS_OPTIONS = [
  { id: 'no_current_basis', label: 'No Current Basis' },
  { id: 'no_initial_basis', label: 'No Initial Basis' },
]

const INTERNATIONAL_REGISTRATION_OPTIONS = [
  { id: 'int_reg_number', label: 'Registration Number' },
  { id: 'int_status_code', label: 'Status Code' },
  { id: 'priority_claimed', label: 'Priority Claimed' },
  { id: 'first_refusal', label: 'First Refusal' },
]

const ACQUIRED_DISTINCTIVENESS_OPTIONS = [
  { id: 'acquired_distinctiveness_whole', label: 'Acquired Distinctiveness (Whole)' },
  { id: 'acquired_distinctiveness_part', label: 'Acquired Distinctiveness (Part)' },
]

export default function SearchOptions({ onSelect, onClose, booleanStrategies }: SearchOptionsProps) {
  const handleSelect = (id: string, group: string, label: string) => {
    onSelect(id, group, label);
  };

  const renderSection = (title: string, options: { id: string, label: string }[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">{title}</h3>
      <div className="space-y-1">
        {options.map(({ id, label }) => (
          <div 
            key={id} 
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors"
            onClick={() => handleSelect(id, title, label)}
          >
            <Label className="text-base cursor-pointer flex-1 hover:text-blue-600">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      {renderSection('General Search', GENERAL_OPTIONS)}
      {renderSection('Classification', CLASSIFICATION_OPTIONS)}
      {renderSection('Visual Characteristics', VISUAL_CHARACTERISTICS_OPTIONS)}
      {renderSection('Filing Status', FILING_STATUS_OPTIONS)}
      {renderSection('Filing Basis', FILING_BASIS_OPTIONS)}
      {renderSection('Date Filters', DATE_OPTIONS)}
      {renderSection('Owner Information', OWNER_OPTIONS)}
      {renderSection('International Registration', INTERNATIONAL_REGISTRATION_OPTIONS)}
      {renderSection('Registration Type', REGISTRATION_TYPE_OPTIONS)}
      {renderSection('Register Type', REGISTER_TYPE_OPTIONS)}
      {renderSection('Application Status', APPLICATION_STATUS_OPTIONS)}
      {renderSection('Acquired Distinctiveness', ACQUIRED_DISTINCTIVENESS_OPTIONS)}
    </div>
  )
}

