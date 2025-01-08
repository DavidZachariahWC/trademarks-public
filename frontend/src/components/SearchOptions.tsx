// SearchOptions.tsx
'use client'

import { useState } from 'react'
import CoordinatedClassSelector from './CoordinatedClassSelector'
import HelpText from './HelpText'

// Strategies that are boolean filters (no user input required)
const BOOLEAN_STRATEGIES = new Set([
  'section_12c',
  'section_8',
  'section_15',
  'no_current_basis',
  'no_initial_basis',
  'change_registration',
  'concurrent_use',
  'concurrent_use_proceeding',
  'name_change',
  'color_drawing',
  'three_d_drawing',
  'prior_registration_present',
  'standard_character_claim',
  'acquired_distinctiveness_whole',
  'acquired_distinctiveness_part',
  'assignment_recorded',
  'priority_claimed',
  'first_refusal'
])

interface FilterComponentProps {
  onOptionChange: (option: string, checked: boolean) => void
}

interface SearchOptionsProps {
  selectedOptions: Set<string>
  selectedBooleanOptions: Set<string>
  onOptionChange: (option: string, checked: boolean) => void
  onBooleanOptionChange: (option: string) => void
}

interface SearchOptionProps {
  label: string
  value: string
  defaultChecked?: boolean
  onChange: (option: string, checked: boolean) => void
  helpText?: string
}

export default function SearchOptions({ selectedOptions, selectedBooleanOptions, onOptionChange, onBooleanOptionChange }: SearchOptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedCoordinatedClasses, setSelectedCoordinatedClasses] = useState<string[]>([])

  const handleCoordinatedClassChange = (classes: string[]) => {
    setSelectedCoordinatedClasses(classes)
    // You may want to update the parent component or perform other actions here
  }

  const handleOptionChange = (option: string, checked: boolean) => {
    if (BOOLEAN_STRATEGIES.has(option)) {
      onBooleanOptionChange(option)
    } else {
      onOptionChange(option, checked)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search Options</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SearchOption
          label="Serial Number"
          value="serial_number"
          onChange={handleOptionChange}
          helpText="The unique identification number assigned by the USPTO to a trademark application"
        />
        <SearchOption
          label="Registration Number"
          value="registration_number"
          onChange={handleOptionChange}
          helpText="The unique number assigned by the USPTO to a trademark registration"
        />
        <SearchOption
          label="Wordmark"
          value="wordmark"
          defaultChecked
          onChange={handleOptionChange}
          helpText="Search for trademarks that consist of text"
        />
        <SearchOption
          label="Phonetic"
          value="phonetic"
          onChange={handleOptionChange}
        />
        <SearchOption
          label="Attorney Name"
          value="attorney"
          onChange={handleOptionChange}
          helpText="The name of the attorney who filed the trademark application"
        />
        <SearchOption
          label="Disclaimer Statements"
          value="disclaimer_statements"
          onChange={handleOptionChange}
        />
        <SearchOption
          label="Description of Mark"
          value="description_of_mark"
          onChange={handleOptionChange}
          helpText="The literal description of the mark as it appears in the drawing"
        />
        <SearchOption
          label="Registration Date"
          value="registration_date"
          onChange={handleOptionChange}
          helpText="The date the trademark was registered with the USPTO"
        />
        <SearchOption
          label="Renewal Date"
          value="renewal_date"
          onChange={handleOptionChange}
          helpText="The date the trademark registration was renewed"
        />
      </div>
      {showAdvanced && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Advanced Options</h3>
          <div className="space-y-4">
            <FilingStatusFilters onOptionChange={handleOptionChange} />
            <FilingBasisFilters onOptionChange={handleOptionChange} />
            <ClassificationFilters onOptionChange={handleOptionChange} />
            <CoordinatedClassSelector onSelectionChange={handleCoordinatedClassChange} />
            <InternationalRegistrationFilters onOptionChange={handleOptionChange} />
            <FilingDateFilters onOptionChange={handleOptionChange} />
            <OwnerFilters onOptionChange={handleOptionChange} />
            <VisualCharacteristicsFilters onOptionChange={handleOptionChange} />
            <PriorRegistrationFilters onOptionChange={handleOptionChange} />
            <ForeignApplicationFilters onOptionChange={handleOptionChange} />
            <AcquiredDistinctivenessFilters onOptionChange={handleOptionChange} />
          </div>
        </div>
      )}
    </div>
  )
}

function SearchOption({ label, value, defaultChecked = false, onChange, helpText }: SearchOptionProps) {
  if (BOOLEAN_STRATEGIES.has(value)) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(value, true)}
          className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {label}
        </button>
        {helpText && <HelpText text={helpText} />}
      </div>
    )
  }

  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="searchType"
        value={value}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="form-checkbox"
      />
      <span>{label}</span>
      {helpText && <HelpText text={helpText} />}
    </label>
  )
}

function FilingStatusFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Filing Status</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Section 12c Filed"
          value="section_12c"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Section 8 Filed"
          value="section_8"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Section 15 Filed"
          value="section_15"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Cancellation Date"
          value="cancellation_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Changed Registration"
          value="change_registration"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Concurrent Use"
          value="concurrent_use"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Concurrent Use Proceeding Pending"
          value="concurrent_use_proceeding"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Assignment Recorded"
          value="assignment_recorded"
          onChange={onOptionChange}
        />
      </div>
    </div>
  )
}

function FilingBasisFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Filing Basis</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Foreign Priority Claim (44(d))"
          value="foreign_priority"
          onChange={onOptionChange}
          helpText="The applicant claims a right of priority based on an earlier-filed foreign application"
        />
        <SearchOption
          label="Foreign Registration (44(e))"
          value="foreign_registration"
          onChange={onOptionChange}
          helpText="The applicant owns a registration of the same mark in the applicant's country of origin"
        />
        <SearchOption
          label="Extension of Protection (66(a))"
          value="extension_protection"
          onChange={onOptionChange}
          helpText="The application is a request for extension of protection of an international registration to the United States"
        />
        <SearchOption
          label="No Current Basis"
          value="no_current_basis"
          onChange={onOptionChange}
        />
        <SearchOption
          label="No Initial Basis"
          value="no_initial_basis"
          onChange={onOptionChange}
        />
      </div>
    </div>
  )
}

function ClassificationFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Classification</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="International Class"
          value="international_class"
          onChange={onOptionChange}
          helpText="The class number(s) assigned to the goods and/or services"
        />
        <SearchOption
          label="US Class"
          value="us_class"
          onChange={onOptionChange}
          helpText="The U.S. class number(s) assigned to the goods and/or services"
        />
      </div>
    </div>
  )
}

function InternationalRegistrationFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">International Registration</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Registration Number"
          value="int_reg_number"
          onChange={onOptionChange}
          helpText="The registration number assigned by the International Bureau of the World Intellectual Property Organization"
        />
        <SearchOption
          label="Registration Date"
          value="int_reg_date"
          onChange={onOptionChange}
          helpText="The date of the international registration"
        />
        <SearchOption
          label="Publication Date"
          value="int_pub_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Auto Protection Date"
          value="auto_protection_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Status Code"
          value="int_status_code"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Priority Claimed"
          value="priority_claimed"
          onChange={onOptionChange}
        />
        <SearchOption
          label="First Refusal"
          value="first_refusal"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Renewal Date"
          value="international_renewal_date"
          onChange={onOptionChange}
        />
      </div>
    </div>
  )
}

function FilingDateFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Filing Date</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Filing Date"
          value="filing_date"
          onChange={onOptionChange}
          helpText="The date the initial application was received by the USPTO"
        />
        <SearchOption
          label="Foreign Filing Date"
          value="foreign_filing_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Published Opposition Date"
          value="published_opposition_date"
          onChange={onOptionChange}
        />
      </div>
      <div id="oppositionDateInputs" className="grid grid-cols-2 gap-2">
        <input type="date" id="oppositionStartDate" className="form-input" placeholder="Start Date" />
        <input type="date" id="oppositionEndDate" className="form-input" placeholder="End Date" />
      </div>
    </div>
  )
}

function OwnerFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Owner Information</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Owner's Name"
          value="owner_name"
          onChange={onOptionChange}
          helpText="The name of the owner of the mark"
        />
        <SearchOption
          label="DBA/AKA Name"
          value="dba_name"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Name Change"
          value="name_change"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Legal Entity Type"
          value="owner_legal_entity"
          onChange={onOptionChange}
          helpText="The type of legal entity of the owner (e.g., individual, corporation, limited liability company)"
        />
        <SearchOption
          label="Party Type"
          value="owner_party_type"
          onChange={onOptionChange}
        />
      </div>
    </div>
  )
}

function VisualCharacteristicsFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Visual Characteristics</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <SearchOption
            label="Drawing Code"
            value="drawing_code_type"
            onChange={onOptionChange}
            helpText="The code that categorizes the mark based on its visual appearance"
          />
          <select id="drawingCodeSelect" className="form-select">
            <option value="0">0 - Not yet assigned</option>
            <option value="1">1 - Typeset word(s)/letter(s)/number(s)</option>
            <option value="2">2 - Design without text</option>
            <option value="3">3 - Design with text</option>
            <option value="4">4 - Standard character mark</option>
            <option value="5">5 - Stylized text with design</option>
            <option value="6">6 - No drawing (e.g., sound)</option>
          </select>
        </div>
        <SearchOption
          label="Design Code"
          value="design_code"
          onChange={onOptionChange}
          helpText="The six-digit numerical code(s) used to describe the figurative elements of a mark"
        />
        <SearchOption
          label="Color Drawing"
          value="color_drawing"
          onChange={onOptionChange}
        />
        <SearchOption
          label="3-D Drawing"
          value="three_d_drawing"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Standard Character Claim"
          value="standard_character_claim"
          onChange={onOptionChange}
          helpText="The mark is in standard characters without claim to any particular font style, size, or color"
        />
      </div>
    </div>
  )
}

function PriorRegistrationFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Prior Registration</h4>
      <SearchOption
        label="Prior Registration Present"
        value="prior_registration_present"
        onChange={onOptionChange}
      />
    </div>
  )
}

function ForeignApplicationFilters({ onOptionChange }: FilterComponentProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Foreign Application</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="Registration Date"
          value="foreign_registration_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Renewal Date"
          value="foreign_renewal_date"
          onChange={onOptionChange}
        />
        <SearchOption
          label="Priority Date Range"
          value="priority_date_range"
          onChange={onOptionChange}
        />
      </div>
      <div id="priorityDateInputs" className="grid grid-cols-2 gap-2">
        <input type="date" id="priorityStartDate" className="form-input" placeholder="Start Date" />
        <input type="date" id="priorityEndDate" className="form-input" placeholder="End Date" />
      </div>
    </div>
  )
}

function AcquiredDistinctivenessFilters({ onOptionChange }: FilterComponentProps ) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Acquired Distinctiveness Claim</h4>
      <div className="grid grid-cols-2 gap-2">
        <SearchOption
          label="In Whole"
          value="acquired_distinctiveness_whole"
          onChange={onOptionChange}
          helpText="The entire mark has acquired distinctiveness"
        />
        <SearchOption
          label="In Part"
          value="acquired_distinctiveness_part"
          onChange={onOptionChange}
          helpText="A portion of the mark has acquired distinctiveness"
        />
      </div>
    </div>
  )
}

