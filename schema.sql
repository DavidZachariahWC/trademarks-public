CREATE TABLE ApplicationInformation (
    application_information_id SERIAL PRIMARY KEY,
    creation_datetime TIMESTAMP,
    data_available_code VARCHAR(1)
);

CREATE TABLE CaseFile (
    serial_number INT PRIMARY KEY,
    registration_number VARCHAR(255),
    transaction_date DATE,
    caswapplication_information_id INT,
    FOREIGN KEY (application_information_id) REFERENCES ApplicationInformation(application_information_id)
);

CREATE TABLE CaseFileHeader (
  case_file_header_id SERIAL PRIMARY KEY,
  serial_number INT,
  filing_date DATE,
  registration_date DATE,
  status_code VARCHAR(3),
  status_date DATE,
  mark_identification TEXT,
  mark_drawing_code VARCHAR(4),
  published_for_opposition_date DATE,
  amend_to_register_date DATE,
  abandonment_date DATE,
  cancellation_code VARCHAR(1),
  cancellation_date DATE,
  republished_12c_date DATE,
  domestic_representative_name TEXT,
  attorney_docket_number VARCHAR(255),
  attorney_name TEXT,
  principal_register_amended_in BOOLEAN,
  supplemental_register_amended_in BOOLEAN,
  trademark_in BOOLEAN,
  collective_trademark_in BOOLEAN,
  service_mark_in BOOLEAN,
  collective_service_mark_in BOOLEAN,
  collective_membership_mark_in BOOLEAN,
  certification_mark_in BOOLEAN,
  cancellation_pending_in BOOLEAN,
  published_concurrent_in BOOLEAN,
  concurrent_use_in BOOLEAN,
  concurrent_use_proceeding_in BOOLEAN,
  interference_pending_in BOOLEAN,
  opposition_pending_in BOOLEAN,
  section_12c_in BOOLEAN,
  section_2f_in BOOLEAN,
  section_2f_in_part_in BOOLEAN,
  renewal_filed_in BOOLEAN,
  section_8_filed_in BOOLEAN,
  section_8_partial_accept_in BOOLEAN,
  section_8_accepted_in BOOLEAN,
  section_15_acknowledged_in BOOLEAN,
  section_15_filed_in BOOLEAN,
  supplemental_register_in BOOLEAN,
  foreign_priority_in BOOLEAN,
  change_registration_in BOOLEAN,
  intent_to_use_in BOOLEAN,
  intent_to_use_current_in BOOLEAN,
  filed_as_use_application_in BOOLEAN,
  amended_to_use_application_in BOOLEAN,
  use_application_currently_in BOOLEAN,
  amended_to_itu_application_in BOOLEAN,
  filing_basis_filed_as_44d_in BOOLEAN,
  amended_to_44d_application_in BOOLEAN,
  filing_basis_current_44d_in BOOLEAN,
  filing_basis_filed_as_44e_in BOOLEAN,
  amended_to_44e_application_in BOOLEAN,
  filing_basis_current_44e_in BOOLEAN,
  without_basis_currently_in BOOLEAN,
  filing_current_no_basis_in BOOLEAN,
  color_drawing_filed_in BOOLEAN,
  color_drawing_current_in BOOLEAN,
  drawing_3d_filed_in BOOLEAN,
  drawing_3d_current_in BOOLEAN,
  standard_characters_claimed_in BOOLEAN,
  filing_basis_filed_as_66a_in BOOLEAN,
  filing_basis_current_66a_in BOOLEAN,
  renewal_date DATE,
  law_office_assigned_location_code VARCHAR(255),
  current_location VARCHAR(255),
  location_date DATE,
  employee_name VARCHAR(255),
  FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);


CREATE TABLE CaseFileStatement (
    case_file_statement_id SERIAL PRIMARY KEY,
    serial_number INT,
    type_code VARCHAR(6),
    statement_text TEXT,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE CaseFileEventStatement (
    case_file_event_statement_id SERIAL PRIMARY KEY,
    serial_number INT,
    event_code VARCHAR(4),
    event_type VARCHAR(1),
    description_text TEXT,
    event_date DATE,
    event_number INT,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE PriorRegistrationApplication (
    prior_registration_application_id SERIAL PRIMARY KEY,
    serial_number INT,
    other_related_in BOOLEAN,
    relationship_type VARCHAR(1),
    number VARCHAR(8),
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE ForeignApplication (
    foreign_application_id SERIAL PRIMARY KEY,
    serial_number INT,
    foreign_filing_date DATE,
    foreign_registration_date DATE,
    registration_expiration_date DATE,
    registration_renewal_date DATE,
    registration_renewal_expiration_date DATE,
    foreign_application_entry_number INT,  
    application_number VARCHAR(12),  
    foreign_country VARCHAR(2), 
    foreign_other VARCHAR(3), 
    foreign_registration_number VARCHAR(12),  
    renewal_number VARCHAR(12), 
    foreign_priority_claim_in BOOLEAN,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE Classification (
  classification_id SERIAL PRIMARY KEY,
  serial_number INT,
  international_code_total_no INT,
  us_code_total_no INT,
  international_code VARCHAR(3),
  us_code VARCHAR(3),
  classification_status_code VARCHAR(1),
  classification_status_date DATE,
  first_use_anywhere_date DATE,
  first_use_in_commerce_date DATE,
  primary_code VARCHAR(3),
  FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE Correspondent (
    correspondent_id SERIAL PRIMARY KEY,
    serial_number INT,
    address_1 TEXT,
    address_2 TEXT,
    address_3 TEXT,
    address_4 TEXT,
    address_5 TEXT,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE Owner (
    owner_id SERIAL PRIMARY KEY,
    serial_number INT,
    owner_entry_number INT,
    party_type INT,
    nationality_country VARCHAR(3), -- Store the country code for nationality
    nationality_state VARCHAR(2),   -- Store the state code if applicable
    nationality_other VARCHAR(3),  -- Store other nationality if neither country nor state
    legal_entity_type_code INT,
    entity_statement TEXT, 
    party_name TEXT,
    owner_address_1 TEXT,
    owner_address_2 TEXT,
    city VARCHAR(40),
    owner_state VARCHAR(2),   -- 2-letter state code
    owner_country VARCHAR(3), -- Country code
    owner_other VARCHAR(3),  -- 3-digit 'other' code
    postcode VARCHAR(15),
    dba_aka_text TEXT,
    composed_of_statement TEXT,
    name_change_explanation TEXT,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);


CREATE TABLE DesignSearch (
    design_search_id SERIAL PRIMARY KEY,
    serial_number INT,
    design_search_code INT,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE InternationalRegistration (
    international_registration_id SERIAL PRIMARY KEY,
    serial_number INT,
    international_registration_number INT,
    international_registration_date DATE,
    international_publication_date DATE,
    international_renewal_date DATE,
    auto_protection_date DATE,
    international_death_date DATE,
    international_status_code INT, 
    international_status_date DATE,
    priority_claimed_in BOOLEAN,
    priority_claimed_date DATE,
    first_refusal_in BOOLEAN,
    notification_date DATE, 
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);

CREATE TABLE MadridInternationalFilingRequest (
    madrid_international_filing_id SERIAL PRIMARY KEY,
    serial_number INT,
    madrid_filing_entry_number INT,
    reference_number INT,
    original_filing_date_uspto DATE,
    madrid_international_registration_number VARCHAR(10),
    madrid_international_registration_date DATE,
    madrid_international_filing_status_code INT,
    madrid_international_filing_status_date DATE,
    irregularity_reply_by_date DATE,
    madrid_international_filing_renewal_date DATE,
    FOREIGN KEY (serial_number) REFERENCES CaseFile(serial_number)
);


CREATE TABLE MadridHistoryEvent (
  madrid_history_event_id SERIAL PRIMARY KEY,
  madrid_international_filing_id INT,
  madrid_history_event_code TEXT,
  madrid_history_event_date DATE,
  event_description_text TEXT,
  madrid_history_entry_number INT,
 FOREIGN KEY (madrid_international_filing_id) REFERENCES MadridInternationalFilingRequest(madrid_international_filing_id)
);