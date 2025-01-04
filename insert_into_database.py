import psycopg2
import psycopg2.extras
import xml.sax
import sys
from datetime import datetime
import logging
import traceback
import xml.sax.handler
from psycopg2 import errors

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('trademark_parser.log'),
        logging.StreamHandler()
    ]
)

# Database connection parameters
DB_PARAMS = {
    'host': 'trademarks.cp8g8oucmbr9.us-west-1.rds.amazonaws.com',
    'database': 'trademarks',
    'user': 'rocketdito',
    'password': 'Alowicios!123'  
}

# Utility functions
def parse_date(date_str):
    """
    Parse a date in 'YYYYMMDD', 'YYYYMM', or 'YYYY' format. 
    If the month is '00', fallback to '01' (January).
    If the day is '00', fallback to '01' (1st day of the month).
    If only 'YYYYMM', fallback day to '01'.
    If only 'YYYY', fallback to '0101'.
    Return a datetime.date or None if parsing fails.
    """
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip()

    # Handle just the year (YYYY)
    if len(date_str) == 4:
        date_str += '0101'  # e.g. 1855 -> 18550101
    # Handle year+month (YYYYMM)
    elif len(date_str) == 6:
        date_str += '01'    # e.g. 185501 -> 18550101
    # If not 4, 6, or 8 digits, give up
    elif len(date_str) != 8:
        return None

    # Now we have YYYYMMDD. Fix invalid '00' parts:
    # Month=00 -> fallback to 01
    if date_str[4:6] == '00':
        date_str = date_str[:4] + '01' + date_str[6:]

    # Day=00 -> fallback to 01
    if date_str[6:8] == '00':
        date_str = date_str[:6] + '01'

    # Attempt to parse
    try:
        return datetime.strptime(date_str, '%Y%m%d').date()
    except ValueError:
        return None

def parse_boolean(bool_str):
    if bool_str is None:
        return None
    bool_str = bool_str.strip().upper()
    if bool_str == 'T':
        return True
    elif bool_str == 'F':
        return False
    else:
        return None

class TrademarkHandler(xml.sax.ContentHandler):
    def __init__(self, db_params):
        super().__init__()
        self.conn = psycopg2.connect(**db_params)
        self.cursor = self.conn.cursor()
        self.batch_size = 1000  # Adjust based on performance
        self.element_stack = []
        self.current_data = ''
        self.serial_number = None

        # Batches for bulk insertion
        self.case_file_header_batch = []
        self.case_file_statement_batch = []
        self.case_file_event_statement_batch = []
        self.prior_registration_application_batch = []
        self.foreign_application_batch = []
        self.classification_batch = []
        self.owner_batch = []
        self.design_search_batch = []
        self.international_registration_batch = []
        self.madrid_international_filing_request_batch = []
        self.madrid_history_event_batch = []

        # Current data holders
        self.case_file = {}
        self.case_file_header = {}
        self.case_file_statement = {}
        self.case_file_event_statement = {}
        self.prior_registration_application = {}
        self.foreign_application = {}
        self.classification = {}
        self.owner = {}
        self.design_search = {}
        self.international_registration = {}
        self.madrid_international_filing_request = {}
        self.madrid_history_event = {}

        # State flags
        self.in_case_file = False
        self.in_case_file_header = False
        self.in_case_file_statement = False
        self.in_case_file_event_statement = False
        self.in_prior_registration_application = False
        self.in_foreign_application = False
        self.in_classification = False
        self.in_owner = False
        self.in_design_search = False
        self.in_international_registration = False
        self.in_madrid_international_filing_request = False
        self.in_madrid_history_event = False
        self.in_correspondent = False

        self.correspondent = {}
        self.current_madrid_international_filing_id = None
        self.case_file_inserted = False

        # Add these new attributes for classification handling
        self.classification_base = {}
        self.international_codes = []
        self.us_codes = []

        # Add nationality flag
        self.in_nationality = False

        # Add new flags for prior registration applications structure
        self.in_prior_registration_applications = False
        self.in_other_related_in = False
        self.other_related_in_value = None

    def startElement(self, name, attrs):
        self.element_stack.append(name)
        self.current_data = ''
        if name == 'case-file':
            self.in_case_file = True
            self.case_file = {}
            self.case_file_inserted = False
        elif name == 'case-file-header':
            self.in_case_file_header = True
            self.case_file_header = {}
        elif name == 'case-file-statement':
            self.in_case_file_statement = True
            self.case_file_statement = {}
        elif name == 'case-file-event-statement':
            self.in_case_file_event_statement = True
            self.case_file_event_statement = {}
        elif name == 'prior-registration-application':
            self.in_prior_registration_application = True
            self.prior_registration_application = {}
        elif name == 'foreign-application':
            self.in_foreign_application = True
            self.foreign_application = {}
        elif name == 'classification':
            self.in_classification = True
            self.classification_base = {}
            self.international_codes = []
            self.us_codes = []
        elif name == 'case-file-owner':
            self.in_owner = True
            self.owner = {}
            self.in_nationality = False
        elif name == 'nationality' and self.in_owner:
            # We're inside <case-file-owner> -> <nationality>
            self.in_nationality = True
        elif name == 'design-search':
            self.in_design_search = True
            self.design_search = {}
        elif name == 'international-registration':
            self.in_international_registration = True
            self.international_registration = {}
        elif name == 'madrid-international-filing-request':
            self.in_madrid_international_filing_request = True
            self.madrid_international_filing_request = {}
            self.current_madrid_international_filing_id = None
        elif name == 'madrid-history-event':
            self.in_madrid_history_event = True
            self.madrid_history_event = {}
        elif name == 'correspondent':
            self.in_correspondent = True
            self.correspondent = {}
        elif name == 'prior-registration-applications':
            self.in_prior_registration_applications = True
            # Use a temporary variable to hold the other-related-in value
            self.other_related_in_value = None
        
        elif name == 'other-related-in' and self.in_prior_registration_applications:
            # We're specifically reading the <other-related-in> inside <prior-registration-applications>
            self.in_other_related_in = True

        elif name == 'prior-registration-application':
            self.in_prior_registration_application = True
            self.prior_registration_application = {}

    def endElement(self, name):
        try:
            if name == 'serial-number' and self.in_case_file and not any([
                self.in_case_file_header, self.in_case_file_statement,
                self.in_case_file_event_statement, self.in_prior_registration_application,
                self.in_foreign_application, self.in_classification, self.in_owner,
                self.in_design_search, self.in_international_registration,
                self.in_madrid_international_filing_request
            ]):
                self.case_file['serial_number'] = self.current_data.strip()
                self.serial_number = self.case_file['serial_number']
                if not self.case_file_inserted and 'registration_number' in self.case_file and 'transaction_date' in self.case_file:
                    self.insert_case_file_record()
                    self.case_file_inserted = True

            elif name == 'registration-number' and self.in_case_file and not self.in_case_file_header:
                self.case_file['registration_number'] = self.current_data.strip()
                if not self.case_file_inserted and 'serial_number' in self.case_file and 'transaction_date' in self.case_file:
                    self.insert_case_file_record()
                    self.case_file_inserted = True

            elif name == 'transaction-date' and self.in_case_file and not self.in_case_file_header:
                self.case_file['transaction_date'] = parse_date(self.current_data)
                if not self.case_file_inserted and 'serial_number' in self.case_file and 'registration_number' in self.case_file:
                    self.insert_case_file_record()
                    self.case_file_inserted = True

            elif name == 'case-file':
                self.in_case_file = False
                if not self.case_file_inserted:
                    if all(key in self.case_file for key in ['serial_number', 'registration_number', 'transaction_date']):
                        self.insert_case_file_record()
                        self.case_file_inserted = True
                    else:
                        missing_fields = [field for field in ['serial_number', 'registration_number', 'transaction_date'] 
                                       if field not in self.case_file]
                        logging.error(f"Cannot insert CaseFile record due to missing required fields: {missing_fields}")
                        raise Exception(f"Missing required fields for CaseFile: {missing_fields}")
                self.case_file = {}

            elif self.in_case_file_header:
                header_field_mappings = {
                    'filing-date': 'filing_date',
                    'registration-date': 'registration_date',
                    'status-code': 'status_code',
                    'status-date': 'status_date',
                    'mark-identification': 'mark_identification',
                    'mark-drawing-code': 'mark_drawing_code',
                    'published-for-opposition-date': 'published_for_opposition_date',
                    'amend-to-register-date': 'amend_to_register_date',
                    'abandonment-date': 'abandonment_date',
                    'cancellation-code': 'cancellation_code',
                    'cancellation-date': 'cancellation_date',
                    'republished-12c-date': 'republished_12c_date',
                    'domestic-representative-name': 'domestic_representative_name',
                    'attorney-docket-number': 'attorney_docket_number',
                    'attorney-name': 'attorney_name',
                    'principal-register-amended-in': 'principal_register_amended_in',
                    'supplemental-register-amended-in': 'supplemental_register_amended_in',
                    'trademark-in': 'trademark_in',
                    'collective-trademark-in': 'collective_trademark_in',
                    'service-mark-in': 'service_mark_in',
                    'collective-service-mark-in': 'collective_service_mark_in',
                    'collective-membership-mark-in': 'collective_membership_mark_in',
                    'certification-mark-in': 'certification_mark_in',
                    'cancellation-pending-in': 'cancellation_pending_in',
                    'published-concurrent-in': 'published_concurrent_in',
                    'concurrent-use-in': 'concurrent_use_in',
                    'concurrent-use-proceeding-in': 'concurrent_use_proceeding_in',
                    'interference-pending-in': 'interference_pending_in',
                    'opposition-pending-in': 'opposition_pending_in',
                    'section-12c-in': 'section_12c_in',
                    'section-2f-in': 'section_2f_in',
                    'section-2f-in-part-in': 'section_2f_in_part_in',
                    'renewal-filed-in': 'renewal_filed_in',
                    'section-8-filed-in': 'section_8_filed_in',
                    'section-8-partial-accept-in': 'section_8_partial_accept_in',
                    'section-8-accepted-in': 'section_8_accepted_in',
                    'section-15-acknowledged-in': 'section_15_acknowledged_in',
                    'section-15-filed-in': 'section_15_filed_in',
                    'supplemental-register-in': 'supplemental_register_in',
                    'foreign-priority-in': 'foreign_priority_in',
                    'change-registration-in': 'change_registration_in',
                    'intent-to-use-in': 'intent_to_use_in',
                    'intent-to-use-current-in': 'intent_to_use_current_in',
                    'filed-as-use-application-in': 'filed_as_use_application_in',
                    'amended-to-use-application-in': 'amended_to_use_application_in',
                    'use-application-currently-in': 'use_application_currently_in',
                    'amended-to-itu-application-in': 'amended_to_itu_application_in',
                    'filing-basis-filed-as-44d-in': 'filing_basis_filed_as_44d_in',
                    'amended-to-44d-application-in': 'amended_to_44d_application_in',
                    'filing-basis-current-44d-in': 'filing_basis_current_44d_in',
                    'filing-basis-filed-as-44e-in': 'filing_basis_filed_as_44e_in',
                    'amended-to-44e-application-in': 'amended_to_44e_application_in',
                    'filing-basis-current-44e-in': 'filing_basis_current_44e_in',
                    'without-basis-currently-in': 'without_basis_currently_in',
                    'filing-current-no-basis-in': 'filing_current_no_basis_in',
                    'color-drawing-filed-in': 'color_drawing_filed_in',
                    'color-drawing-current-in': 'color_drawing_current_in',
                    'drawing-3d-filed-in': 'drawing_3d_filed_in',
                    'drawing-3d-current-in': 'drawing_3d_current_in',
                    'standard-characters-claimed-in': 'standard_characters_claimed_in',
                    'filing-basis-filed-as-66a-in': 'filing_basis_filed_as_66a_in',
                    'filing-basis-current-66a-in': 'filing_basis_current_66a_in',
                    'renewal-date': 'renewal_date',
                    'law-office-assigned-location-code': 'law_office_assigned_location_code',
                    'current-location': 'current_location',
                    'location-date': 'location_date',
                    'employee-name': 'employee_name',
                }
                if name in header_field_mappings:
                    column_name = header_field_mappings[name]
                    if 'date' in column_name:
                        self.case_file_header[column_name] = parse_date(self.current_data)
                    elif column_name.endswith('_in'):
                        self.case_file_header[column_name] = parse_boolean(self.current_data)
                    else:
                        self.case_file_header[column_name] = self.current_data.strip()
                elif name == 'case-file-header':
                    self.in_case_file_header = False
                    self.case_file_header['serial_number'] = self.serial_number
                    self.case_file_header_batch.append(self.case_file_header)
                    if len(self.case_file_header_batch) >= self.batch_size:
                        self.insert_case_file_header_batch()
                        self.case_file_header_batch.clear()

            elif self.in_case_file_statement:
                if name == 'type-code':
                    self.case_file_statement['type_code'] = self.current_data.strip()
                elif name == 'text':
                    self.case_file_statement['statement_text'] = self.current_data.strip()
                elif name == 'case-file-statement':
                    self.in_case_file_statement = False
                    self.case_file_statement['serial_number'] = self.serial_number
                    self.case_file_statement_batch.append(self.case_file_statement)
                    if len(self.case_file_statement_batch) >= self.batch_size:
                        self.insert_case_file_statement_batch()
                        self.case_file_statement_batch.clear()

            elif self.in_case_file_event_statement:
                if name == 'code':
                    self.case_file_event_statement['event_code'] = self.current_data.strip()
                elif name == 'type':
                    self.case_file_event_statement['event_type'] = self.current_data.strip()
                elif name == 'description-text':
                    self.case_file_event_statement['description_text'] = self.current_data.strip()
                elif name == 'date':
                    self.case_file_event_statement['event_date'] = parse_date(self.current_data)
                elif name == 'number':
                    self.case_file_event_statement['event_number'] = int(self.current_data.strip())
                elif name == 'case-file-event-statement':
                    self.in_case_file_event_statement = False
                    self.case_file_event_statement['serial_number'] = self.serial_number
                    self.case_file_event_statement_batch.append(self.case_file_event_statement)
                    if len(self.case_file_event_statement_batch) >= self.batch_size:
                        self.insert_case_file_event_statement_batch()
                        self.case_file_event_statement_batch.clear()

            elif self.in_prior_registration_applications:
                if name == 'other-related-in':
                    # Finished reading <other-related-in>
                    self.in_other_related_in = False
                    self.other_related_in_value = parse_boolean(self.current_data)

                elif self.in_prior_registration_application:
                    if name == 'relationship-type':
                        self.prior_registration_application['relationship_type'] = self.current_data.strip()
                    elif name == 'number':
                        self.prior_registration_application['number'] = self.current_data.strip()
                    elif name == 'prior-registration-application':
                        self.in_prior_registration_application = False
                        # Attach the single other_related_in_value to this registration
                        self.prior_registration_application['other_related_in'] = self.other_related_in_value
                        # Set serial_number just before adding to batch (consistent with rest of script)
                        self.prior_registration_application['serial_number'] = self.serial_number
                        self.prior_registration_application_batch.append(self.prior_registration_application)
                        if len(self.prior_registration_application_batch) >= self.batch_size:
                            self.insert_prior_registration_application_batch()
                            self.prior_registration_application_batch.clear()

                elif name == 'prior-registration-applications':
                    self.in_prior_registration_applications = False

            elif self.in_foreign_application:
                foreign_field_mappings = {
                    'filing-date': 'foreign_filing_date',
                    'registration-date': 'foreign_registration_date',
                    'registration-expiration-date': 'registration_expiration_date',
                    'registration-renewal-date': 'registration_renewal_date',
                    'registration-renewal-expiration-date': 'registration_renewal_expiration_date',
                    'entry-number': 'foreign_application_entry_number',
                    'application-number': 'application_number',
                    'country': 'foreign_country',
                    'other': 'foreign_other',
                    'registration-number': 'foreign_registration_number',
                    'renewal-number': 'renewal_number',
                    'foreign-priority-claim-in': 'foreign_priority_claim_in',
                }
                if name in foreign_field_mappings:
                    column_name = foreign_field_mappings[name]
                    if 'date' in column_name:
                        self.foreign_application[column_name] = parse_date(self.current_data)
                    elif (column_name.endswith('_number') and 
                          column_name not in ['application_number', 'renewal_number', 'foreign_registration_number']):
                        self.foreign_application[column_name] = int(self.current_data.strip())
                    elif column_name.endswith('_in'):
                        self.foreign_application[column_name] = parse_boolean(self.current_data)
                    else:
                        # Store as string to preserve leading zeros
                        self.foreign_application[column_name] = self.current_data.strip()
                elif name == 'foreign-application':
                    self.in_foreign_application = False
                    self.foreign_application['serial_number'] = self.serial_number
                    self.foreign_application_batch.append(self.foreign_application)
                    if len(self.foreign_application_batch) >= self.batch_size:
                        self.insert_foreign_application_batch()
                        self.foreign_application_batch.clear()

            elif self.in_classification:
                classification_field_mappings = {
                    'international-code-total-no': 'international_code_total_no',
                    'us-code-total-no': 'us_code_total_no',
                    'status-code': 'classification_status_code',
                    'status-date': 'classification_status_date',
                    'first-use-anywhere-date': 'first_use_anywhere_date',
                    'first-use-in-commerce-date': 'first_use_in_commerce_date',
                    'primary-code': 'primary_code',
                }

                if name in classification_field_mappings:
                    column_name = classification_field_mappings[name]
                    if 'date' in column_name:
                        self.classification_base[column_name] = parse_date(self.current_data)
                    elif 'total_no' in column_name:
                        self.classification_base[column_name] = int(self.current_data.strip())
                    else:
                        self.classification_base[column_name] = self.current_data.strip()
                elif name == 'international-code':
                    self.international_codes.append(self.current_data.strip())
                elif name == 'us-code':
                    self.us_codes.append(self.current_data.strip())
                elif name == 'classification':
                    self.in_classification = False
                    
                    # If no codes were encountered, create one "generic" classification record
                    if not self.international_codes and not self.us_codes:
                        classification_record = self.classification_base.copy()
                        classification_record['serial_number'] = self.serial_number
                        self.classification_batch.append(classification_record)
                    else:
                        # Create a record for each international code
                        for intl_code in self.international_codes:
                            classification_record = self.classification_base.copy()
                            classification_record['serial_number'] = self.serial_number
                            classification_record['international_code'] = intl_code
                            classification_record['us_code'] = None
                            self.classification_batch.append(classification_record)

                        # Create a record for each US code
                        for us_code in self.us_codes:
                            classification_record = self.classification_base.copy()
                            classification_record['serial_number'] = self.serial_number
                            classification_record['international_code'] = None
                            classification_record['us_code'] = us_code
                            self.classification_batch.append(classification_record)

                    # Check if we need to flush the batch
                    if len(self.classification_batch) >= self.batch_size:
                        self.insert_classification_batch()
                        self.classification_batch.clear()

            elif self.in_owner:
                if self.in_nationality:
                    # Handle elements nested under <nationality>
                    if name == 'state':
                        self.owner['nationality_state'] = self.current_data.strip()
                    elif name == 'country':
                        self.owner['nationality_country'] = self.current_data.strip()
                    elif name == 'other':
                        self.owner['nationality_other'] = self.current_data.strip()
                    elif name == 'nationality':
                        self.in_nationality = False
                else:
                    # Handle top-level fields within <case-file-owner>
                    if name == 'entry-number':
                        self.owner['owner_entry_number'] = int(self.current_data.strip())
                    elif name == 'party-type':
                        self.owner['party_type'] = int(self.current_data.strip())
                    elif name == 'legal-entity-type-code':
                        self.owner['legal_entity_type_code'] = int(self.current_data.strip())
                    elif name == 'entity-statement':
                        self.owner['entity_statement'] = self.current_data.strip()
                    elif name == 'party-name':
                        self.owner['party_name'] = self.current_data.strip()
                    elif name == 'address-1':
                        self.owner['owner_address_1'] = self.current_data.strip()
                    elif name == 'address-2':
                        self.owner['owner_address_2'] = self.current_data.strip()
                    elif name == 'city':
                        self.owner['city'] = self.current_data.strip()
                    elif name == 'state':
                        self.owner['owner_state'] = self.current_data.strip()
                    elif name == 'country':
                        self.owner['owner_country'] = self.current_data.strip()
                    elif name == 'other':
                        self.owner['owner_other'] = self.current_data.strip()
                    elif name == 'postcode':
                        self.owner['postcode'] = self.current_data.strip()
                    elif name == 'dba-aka-text':
                        self.owner['dba_aka_text'] = self.current_data.strip()
                    elif name == 'composed-of-statement':
                        self.owner['composed_of_statement'] = self.current_data.strip()
                    elif name == 'name-change-explanation':
                        self.owner['name_change_explanation'] = self.current_data.strip()
                    elif name == 'case-file-owner':
                        self.in_owner = False
                        self.owner['serial_number'] = self.serial_number
                        self.owner_batch.append(self.owner)
                        if len(self.owner_batch) >= self.batch_size:
                            self.insert_owner_batch()
                            self.owner_batch.clear()

            elif self.in_design_search:
                if name == 'code':
                    # Store the code as a string to preserve leading zeros
                    self.design_search['design_search_code'] = self.current_data.strip()
                elif name == 'design-search':
                    self.in_design_search = False
                    self.design_search['serial_number'] = self.serial_number
                    self.design_search_batch.append(self.design_search)
                    if len(self.design_search_batch) >= self.batch_size:
                        self.insert_design_search_batch()
                        self.design_search_batch.clear()

            elif self.in_international_registration:
                intl_reg_field_mappings = {
                    'international-registration-number': 'international_registration_number',
                    'international-registration-date': 'international_registration_date',
                    'international-publication-date': 'international_publication_date',
                    'international-renewal-date': 'international_renewal_date',
                    'auto-protection-date': 'auto_protection_date',
                    'international-death-date': 'international_death_date',
                    'international-status-code': 'international_status_code',
                    'international-status-date': 'international_status_date',
                    'priority-claimed-in': 'priority_claimed_in',
                    'priority-claimed-date': 'priority_claimed_date',
                    'first-refusal-in': 'first_refusal_in',
                    'notification-date': 'notification_date',
                }

                if name in intl_reg_field_mappings:
                    column_name = intl_reg_field_mappings[name]
                    if 'date' in column_name:
                        self.international_registration[column_name] = parse_date(self.current_data)
                    elif column_name.endswith('_in'):
                        # Booleans
                        self.international_registration[column_name] = parse_boolean(self.current_data)
                    elif column_name in ('international_registration_number', 'international_status_code'):
                        # Convert numeric fields to int
                        self.international_registration[column_name] = int(self.current_data.strip())
                    else:
                        # Everything else is text
                        self.international_registration[column_name] = self.current_data.strip()

                elif name == 'international-registration':
                    self.in_international_registration = False
                    self.international_registration['serial_number'] = self.serial_number
                    self.international_registration_batch.append(self.international_registration)
                    if len(self.international_registration_batch) >= self.batch_size:
                        self.insert_international_registration_batch()
                        self.international_registration_batch.clear()

            elif self.in_madrid_international_filing_request:
                madrid_field_mappings = {
                    'entry-number': 'madrid_filing_entry_number',
                    'reference-number': 'reference_number',
                    'original-filing-date-uspto': 'original_filing_date_uspto',
                    'international-registration-number': 'madrid_international_registration_number',
                    'international-registration-date': 'madrid_international_registration_date',
                    'international-status-code': 'madrid_international_filing_status_code',
                    'international-status-date': 'madrid_international_filing_status_date',
                    'irregularity-reply-by-date': 'irregularity_reply_by_date',
                    'international-renewal-date': 'madrid_international_filing_renewal_date'
                }
                if name in madrid_field_mappings:
                    column_name = madrid_field_mappings[name]
                    if 'date' in column_name:
                        self.madrid_international_filing_request[column_name] = parse_date(self.current_data)
                    elif column_name in ['madrid_filing_entry_number', 'reference_number', 'madrid_international_filing_status_code']:
                        self.madrid_international_filing_request[column_name] = int(self.current_data.strip())
                    else:
                        self.madrid_international_filing_request[column_name] = self.current_data.strip()
                elif name == 'madrid-international-filing-request':
                    self.in_madrid_international_filing_request = False
                    self.madrid_international_filing_request['serial_number'] = self.serial_number
                    columns = list(self.madrid_international_filing_request.keys())
                    placeholders = ', '.join(['%s'] * len(columns))
                    logging.info(f"Inserting into MadridInternationalFilingRequest for serial_number: {self.serial_number}")
                    # for col in columns:
                    #     logging.info(f"  {col}: {self.madrid_international_filing_request.get(col)}")
                    query = f"""
                        INSERT INTO MadridInternationalFilingRequest ({', '.join(columns)})
                        VALUES ({placeholders})
                        RETURNING madrid_international_filing_id
                    """
                    values = [self.madrid_international_filing_request.get(col) for col in columns]
                    self.cursor.execute(query, values)
                    self.current_madrid_international_filing_id = self.cursor.fetchone()[0]
                    self.conn.commit()

            elif self.in_madrid_history_event:
                if name == 'code':
                    self.madrid_history_event['madrid_history_event_code'] = self.current_data.strip()
                elif name == 'date':
                    self.madrid_history_event['madrid_history_event_date'] = parse_date(self.current_data)
                elif name == 'description-text':
                    self.madrid_history_event['event_description_text'] = self.current_data.strip()
                elif name == 'entry-number':
                    self.madrid_history_event['madrid_history_entry_number'] = int(self.current_data.strip())
                elif name == 'madrid-history-event':
                    self.in_madrid_history_event = False
                    self.madrid_history_event['madrid_international_filing_id'] = self.current_madrid_international_filing_id
                    self.madrid_history_event_batch.append(self.madrid_history_event)
                    if len(self.madrid_history_event_batch) >= self.batch_size:
                        self.insert_madrid_history_event_batch()
                        self.madrid_history_event_batch.clear()

            elif self.in_correspondent:
                correspondent_field_mappings = {
                    'address-1': 'address_1',
                    'address-2': 'address_2',
                    'address-3': 'address_3',
                    'address-4': 'address_4',
                    'address-5': 'address_5'
                }
                if name in correspondent_field_mappings:
                    column_name = correspondent_field_mappings[name]
                    self.correspondent[column_name] = self.current_data.strip()
                elif name == 'correspondent':
                    self.in_correspondent = False
                    if self.correspondent:
                        self.correspondent['serial_number'] = self.serial_number
                        columns = list(self.correspondent.keys())
                        placeholders = ', '.join(['%s'] * len(columns))
                        try:
                            # Log the data about to be inserted
                            logging.info("Inserting into Correspondent:")
                            for col in columns:
                                logging.info(f"  {col}: {self.correspondent.get(col)}")
                            query = f"""
                                INSERT INTO Correspondent ({', '.join(columns)})
                                VALUES ({placeholders})
                            """
                            values = [self.correspondent.get(col) for col in columns]
                            self.cursor.execute(query, values)
                            self.conn.commit()
                        except Exception as e:
                            logging.error(f"Error inserting correspondent: {str(e)}")
                            logging.error(f"Correspondent data: {self.correspondent}")
                            logging.error(traceback.format_exc())
                            self.conn.rollback()
                            raise

            self.element_stack.pop()
            self.current_data = ''
        except Exception as e:
            logging.error(f"Error in endElement for tag '{name}': {str(e)}")
            logging.error(f"Current element stack: {self.element_stack}")
            logging.error(f"Current data: {self.current_data}")
            logging.error(traceback.format_exc())
            raise

    def characters(self, content):
        try:
            self.current_data += content
        except Exception as e:
            logging.error(f"Error in characters method: {str(e)}")
            logging.error(f"Content: {content}")
            logging.error(traceback.format_exc())
            raise

    # Batch insertion methods for each table
    def insert_case_file_header_batch(self):
        if not self.case_file_header_batch:
            return
        try:
            columns = [
                'serial_number',
                'filing_date',
                'registration_date',
                'status_code',
                'status_date',
                'mark_identification',
                'mark_drawing_code',
                'published_for_opposition_date',
                'amend_to_register_date',
                'abandonment_date',
                'cancellation_code',
                'cancellation_date',
                'republished_12c_date',
                'domestic_representative_name',
                'attorney_docket_number',
                'attorney_name',
                'principal_register_amended_in',
                'supplemental_register_amended_in',
                'trademark_in',
                'collective_trademark_in',
                'service_mark_in',
                'collective_service_mark_in',
                'collective_membership_mark_in',
                'certification_mark_in',
                'cancellation_pending_in',
                'published_concurrent_in',
                'concurrent_use_in',
                'concurrent_use_proceeding_in',
                'interference_pending_in',
                'opposition_pending_in',
                'section_12c_in',
                'section_2f_in',
                'section_2f_in_part_in',
                'renewal_filed_in',
                'section_8_filed_in',
                'section_8_partial_accept_in',
                'section_8_accepted_in',
                'section_15_acknowledged_in',
                'section_15_filed_in',
                'supplemental_register_in',
                'foreign_priority_in',
                'change_registration_in',
                'intent_to_use_in',
                'intent_to_use_current_in',
                'filed_as_use_application_in',
                'amended_to_use_application_in',
                'use_application_currently_in',
                'amended_to_itu_application_in',
                'filing_basis_filed_as_44d_in',
                'amended_to_44d_application_in',
                'filing_basis_current_44d_in',
                'filing_basis_filed_as_44e_in',
                'amended_to_44e_application_in',
                'filing_basis_current_44e_in',
                'without_basis_currently_in',
                'filing_current_no_basis_in',
                'color_drawing_filed_in',
                'color_drawing_current_in',
                'drawing_3d_filed_in',
                'drawing_3d_current_in',
                'standard_characters_claimed_in',
                'filing_basis_filed_as_66a_in',
                'filing_basis_current_66a_in',
                'renewal_date',
                'law_office_assigned_location_code',
                'current_location',
                'location_date',
                'employee_name',
            ]
            # Log just the serial number, not all attributes
            for record in self.case_file_header_batch:
                logging.info(f"Inserting CaseFileHeader record for serial_number: {record.get('serial_number')}")
                # for col in columns:
                #     logging.info(f"  {col}: {record.get(col)}")

            query = f"INSERT INTO CaseFileHeader ({', '.join(columns)}) VALUES %s"
            values = [tuple(record.get(col) for col in columns) for record in self.case_file_header_batch]
            psycopg2.extras.execute_values(self.cursor, query, values)
            self.conn.commit()
        except Exception as e:
            logging.error(f"Error inserting case file header batch: {str(e)}")
            logging.error(f"First record in batch: {self.case_file_header_batch[0]}")
            logging.error(traceback.format_exc())
            self.conn.rollback()
            raise

    def insert_case_file_statement_batch(self):
        if not self.case_file_statement_batch:
            return
        columns = ['serial_number', 'type_code', 'statement_text']
        for record in self.case_file_statement_batch:
            logging.info(f"Inserting CaseFileStatement record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO CaseFileStatement ({', '.join(columns)}) VALUES %s"
        values = [(
            d.get('serial_number'),
            d.get('type_code'),
            d.get('statement_text')
        ) for d in self.case_file_statement_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_case_file_event_statement_batch(self):
        if not self.case_file_event_statement_batch:
            return
        columns = ['serial_number', 'event_code', 'event_type', 'description_text', 'event_date', 'event_number']
        for record in self.case_file_event_statement_batch:
            logging.info(f"Inserting CaseFileEventStatement record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO CaseFileEventStatement ({', '.join(columns)}) VALUES %s"
        values = [(
            d.get('serial_number'),
            d.get('event_code'),
            d.get('event_type'),
            d.get('description_text'),
            d.get('event_date'),
            d.get('event_number')
        ) for d in self.case_file_event_statement_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_prior_registration_application_batch(self):
        if not self.prior_registration_application_batch:
            return
        columns = ['serial_number', 'other_related_in', 'relationship_type', 'number']
        for record in self.prior_registration_application_batch:
            logging.info(f"Inserting PriorRegistrationApplication record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO PriorRegistrationApplication ({', '.join(columns)}) VALUES %s"
        values = [(
            d.get('serial_number'),
            d.get('other_related_in'),
            d.get('relationship_type'),
            d.get('number')
        ) for d in self.prior_registration_application_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_foreign_application_batch(self):
        if not self.foreign_application_batch:
            return
        columns = [
            'serial_number',
            'foreign_filing_date',
            'foreign_registration_date',
            'registration_expiration_date',
            'registration_renewal_date',
            'registration_renewal_expiration_date',
            'foreign_application_entry_number',
            'application_number',
            'foreign_country',
            'foreign_other',
            'foreign_registration_number',
            'renewal_number',
            'foreign_priority_claim_in'
        ]
        for record in self.foreign_application_batch:
            logging.info(f"Inserting ForeignApplication record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO ForeignApplication ({', '.join(columns)}) VALUES %s"
        values = [tuple(record.get(col) for col in columns) for record in self.foreign_application_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_classification_batch(self):
        if not self.classification_batch:
            return
        columns = [
            'serial_number',
            'international_code_total_no',
            'us_code_total_no',
            'international_code',
            'us_code',
            'classification_status_code',
            'classification_status_date',
            'first_use_anywhere_date',
            'first_use_in_commerce_date',
            'primary_code',
        ]
        for record in self.classification_batch:
            logging.info(f"Inserting Classification record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO Classification ({', '.join(columns)}) VALUES %s"
        values = [tuple(d.get(col) for col in columns) for d in self.classification_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_owner_batch(self):
        if not self.owner_batch:
            return
        columns = [
            'serial_number',
            'owner_entry_number',
            'party_type',
            'nationality_country',
            'nationality_state',
            'nationality_other',
            'legal_entity_type_code',
            'entity_statement',
            'party_name',
            'owner_address_1',
            'owner_address_2',
            'city',
            'owner_state',
            'owner_country',
            'owner_other',
            'postcode',
            'dba_aka_text',
            'composed_of_statement',
            'name_change_explanation',
        ]
        for record in self.owner_batch:
            logging.info(f"Inserting Owner record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO Owner ({', '.join(columns)}) VALUES %s"
        values = [tuple(d.get(col) for col in columns) for d in self.owner_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_design_search_batch(self):
        if not self.design_search_batch:
            return
        columns = ['serial_number', 'design_search_code']
        for record in self.design_search_batch:
            logging.info(f"Inserting DesignSearch record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO DesignSearch ({', '.join(columns)}) VALUES %s"
        values = [(
            d.get('serial_number'),
            d.get('design_search_code')
        ) for d in self.design_search_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_international_registration_batch(self):
        if not self.international_registration_batch:
            return
        columns = [
            'serial_number',
            'international_registration_number',
            'international_registration_date',
            'international_publication_date',
            'international_renewal_date',
            'auto_protection_date',
            'international_death_date',
            'international_status_code',
            'international_status_date',
            'priority_claimed_in',
            'priority_claimed_date',
            'first_refusal_in',
            'notification_date',
        ]
        for record in self.international_registration_batch:
            logging.info(f"Inserting InternationalRegistration record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO InternationalRegistration ({', '.join(columns)}) VALUES %s"
        values = [tuple(d.get(col) for col in columns) for d in self.international_registration_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_madrid_international_filing_request_batch(self):
        if not self.madrid_international_filing_request_batch:
            return
        columns = [
            'serial_number',
            'madrid_filing_entry_number',
            'reference_number',
            'original_filing_date_uspto',
            'madrid_international_registration_number',
            'madrid_international_registration_date',
            'madrid_international_filing_status_code',
            'madrid_international_filing_status_date',
            'irregularity_reply_by_date',
            'madrid_international_filing_renewal_date'
        ]
        for record in self.madrid_international_filing_request_batch:
            logging.info(f"Inserting MadridInternationalFilingRequest record for serial_number: {record.get('serial_number')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO MadridInternationalFilingRequest ({', '.join(columns)}) VALUES %s RETURNING madrid_international_filing_id"
        values = [tuple(d.get(col) for col in columns) for d in self.madrid_international_filing_request_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def insert_madrid_history_event_batch(self):
        if not self.madrid_history_event_batch:
            return
        columns = [
            'madrid_international_filing_id',
            'madrid_history_event_code',
            'madrid_history_event_date',
            'event_description_text',
            'madrid_history_entry_number'
        ]
        for record in self.madrid_history_event_batch:
            logging.info(f"Inserting MadridHistoryEvent record for madrid_international_filing_id: {record.get('madrid_international_filing_id')}")
            # for col in columns:
            #     logging.info(f"  {col}: {record.get(col)}")
        query = f"INSERT INTO MadridHistoryEvent ({', '.join(columns)}) VALUES %s"
        values = [tuple(d.get(col) for col in columns) for d in self.madrid_history_event_batch]
        psycopg2.extras.execute_values(self.cursor, query, values)
        self.conn.commit()

    def endDocument(self):
        if self.case_file_header_batch:
            self.insert_case_file_header_batch()
        if self.case_file_statement_batch:
            self.insert_case_file_statement_batch()
        if self.case_file_event_statement_batch:
            self.insert_case_file_event_statement_batch()
        if self.prior_registration_application_batch:
            self.insert_prior_registration_application_batch()
        if self.foreign_application_batch:
            self.insert_foreign_application_batch()
        if self.classification_batch:
            self.insert_classification_batch()
        if self.owner_batch:
            self.insert_owner_batch()
        if self.design_search_batch:
            self.insert_design_search_batch()
        if self.international_registration_batch:
            self.insert_international_registration_batch()
        if self.madrid_international_filing_request_batch:
            self.insert_madrid_international_filing_request_batch()
        if self.madrid_history_event_batch:
            self.insert_madrid_history_event_batch()

        self.cursor.close()
        self.conn.close()
        logging.info("Processing completed.")

    def insert_case_file_record(self):
        try:
            logging.info(f"Inserting CaseFile record for serial_number: {self.case_file.get('serial_number')}")
            # logging.info(f"  registration_number: {self.case_file.get('registration_number')}")
            # logging.info(f"  transaction_date: {self.case_file.get('transaction_date')}")
            query = """
                INSERT INTO CaseFile (serial_number, registration_number, transaction_date)
                VALUES (%s, %s, %s)
            """
            values = (
                self.case_file.get('serial_number'),
                self.case_file.get('registration_number'),
                self.case_file.get('transaction_date')
            )
            self.cursor.execute(query, values)
            self.conn.commit()
        except Exception as e:
            logging.error(f"Error inserting CaseFile record: {str(e)}")
            logging.error(f"Record data: {self.case_file}")
            self.conn.rollback()
            raise

def main(input_file):
    try:
        parser = xml.sax.make_parser()
        handler = TrademarkHandler(DB_PARAMS)
        parser.setContentHandler(handler)
        parser.parse(input_file)
    except xml.sax.SAXParseException as e:
        logging.error(f"SAXParseException at line {e.getLineNumber()}, column {e.getColumnNumber()}: {e.getMessage()}")
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                error_line = lines[e.getLineNumber() - 1].rstrip()
                logging.error(f"Error line [{e.getLineNumber()}]: {error_line}")
                
                # Log a few lines before and after for context
                start_line = max(0, e.getLineNumber() - 3)
                end_line = min(len(lines), e.getLineNumber() + 2)
                logging.error("Context:")
                for i in range(start_line, end_line):
                    logging.error(f"Line {i+1}: {lines[i].rstrip()}")
        except Exception as file_read_error:
            logging.error(f"Could not read the file to get the error line: {file_read_error}")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Error processing file {input_file}: {str(e)}")
        logging.error(traceback.format_exc())
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        logging.error("Usage: python script.py <input_xml_file>")
        sys.exit(1)
    
    input_xml_file = sys.argv[1]
    try:
        main(input_xml_file)
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}")
        logging.error(traceback.format_exc())
        sys.exit(1)
