export interface CaseHeader {
  mark_identification: string
  status_code: string | null
  status_date: string | null
  filing_date: string | null
  registration_date: string | null
  cancellation_date: string | null
  published_for_opposition_date: string | null
  attorney_name: string | null
  republished_12c_date: string | null
  section_8_partial_accept_in: boolean
  section_8_accepted_in: boolean
  section_15_filed_in: boolean
  section_15_acknowledged_in: boolean
  change_registration_in: boolean
  concurrent_use_in: boolean
  concurrent_use_proceeding_in: boolean
  published_concurrent_in: boolean
  filing_basis_filed_as_44d_in: boolean
  amended_to_44d_application_in: boolean
  filing_basis_current_44d_in: boolean
  filing_basis_filed_as_44e_in: boolean
  amended_to_44e_application_in: boolean
  filing_basis_current_44e_in: boolean
  filing_basis_filed_as_66a_in: boolean
  filing_basis_current_66a_in: boolean
  filing_current_no_basis_in: boolean
  without_basis_currently_in: boolean
  standard_characters_claimed_in: boolean
  mark_drawing_code: string
  color_drawing_current_in: boolean
  color_drawing_filed_in: boolean
  drawing_3d_current_in: boolean
  drawing_3d_filed_in: boolean
  section_2f_in: boolean
  section_2f_in_part_in: boolean
  supplemental_register_in: boolean
}

export interface Classification {
  international_code: string
  us_code: string
  primary_code: string
  classification_status_code: string
  classification_status_date: string | null
  first_use_anywhere_date: string | null
  first_use_in_commerce_date: string | null
}

export interface Statement {
  type_code: string
  statement_text: string
}

export interface EventStatement {
  event_code: string
  event_type: string
  description_text: string
  event_date: string | null
  event_number: string | null
}

export interface DesignSearch {
  design_search_code: string
}

export interface Owner {
  party_name: string
  owner_address_1: string
  owner_address_2?: string
  city?: string
  owner_state?: string
  postcode?: string
  owner_country?: string
  dba_aka_text?: string
  entity_statement?: string
  composed_of_statement?: string
  name_change_explanation?: string
  nationality_country?: string
  nationality_state?: string
  nationality_other?: string
  legal_entity_type_code?: string
  party_type?: string
}

export interface Correspondent {
  address_1: string | null
  address_2: string | null
  address_3: string | null
  address_4: string | null
  address_5: string | null
}

export interface ForeignApplication {
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

export interface InternationalRegistration {
  international_registration_number: string | null
  international_registration_date: string | null
  international_publication_date: string | null
  auto_protection_date: string | null
  international_status_code: string | null
  international_status_date: string | null
  international_renewal_date: string | null
  international_death_date: string | null
  priority_claimed_in: boolean
  priority_claimed_date: string | null
  first_refusal_in: boolean
  notification_date: string | null
}

export interface PriorRegistration {
  number: string
  other_related_in: boolean
  relationship_type: string
}

export interface Case {
  serial_number: string
  registration_number: string | null
  header: CaseHeader
  classifications?: Classification[]
  statements?: Statement[]
  event_statements?: EventStatement[]
  design_searches?: DesignSearch[]
  owners?: Owner[]
  correspondents?: Correspondent[]
  foreign_applications?: ForeignApplication[]
  international_registrations?: InternationalRegistration[]
  prior_registrations?: PriorRegistration[]
}

export interface SearchResult {
  serial_number: number
  registration_number: string | null
  mark_identification: string
  status_code: string
  filing_date: string | null
  registration_date: string | null
  attorney_name: string | null
  similarity_score?: number
  match_quality?: string
}

export interface Pagination {
  current_page: number
  total_pages: number
  total_results: number
  per_page: number
} 