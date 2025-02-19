#models.py
from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, Text, ARRAY, TIMESTAMP
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

Base = declarative_base()

class ApplicationInformation(Base):
    __tablename__ = 'applicationinformation'

    application_information_id = Column(Integer, primary_key=True)
    creation_datetime = Column(TIMESTAMP)
    data_available_code = Column(String(1))

    case_files = relationship("CaseFile", back_populates="application_info", cascade="all, delete") # Correct

class CaseFile(Base):
    __tablename__ = 'casefile'

    serial_number = Column(Integer, primary_key=True)
    registration_number = Column(String(255))
    transaction_date = Column(Date)
    application_information_id = Column(Integer, ForeignKey('applicationinformation.application_information_id', ondelete="CASCADE"))

    application_info = relationship("ApplicationInformation", back_populates="case_files", cascade="all, delete") # CORRECTED: Added cascade
    header = relationship("CaseFileHeader", back_populates="case_file", uselist=False, cascade="all, delete") # Correct
    statements = relationship("CaseFileStatement", back_populates="case_file", cascade="all, delete") # Correct
    event_statements = relationship("CaseFileEventStatement", back_populates="case_file", cascade="all, delete") # Correct
    prior_registrations = relationship("PriorRegistrationApplication", back_populates="case_file", cascade="all, delete") # Correct
    foreign_applications = relationship("ForeignApplication", back_populates="case_file", cascade="all, delete") # Correct
    classifications = relationship("Classification", back_populates="case_file", cascade="all, delete") # Correct
    correspondents = relationship("Correspondent", back_populates="case_file", cascade="all, delete") # Correct
    owners = relationship("Owner", back_populates="case_file", cascade="all, delete") # Correct
    design_searches = relationship("DesignSearch", back_populates="case_file", cascade="all, delete") # Correct
    international_registrations = relationship("InternationalRegistration", back_populates="case_file", cascade="all, delete") # Correct
    madrid_filings = relationship("MadridInternationalFilingRequest", back_populates="case_file", cascade="all, delete") # Correct

class CaseFileHeader(Base):
    __tablename__ = 'casefileheader'

    case_file_header_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    filing_date = Column(Date)
    registration_date = Column(Date)
    status_code = Column(String(3))
    status_date = Column(Date)
    mark_identification = Column(Text)
    mark_drawing_code = Column(String(4))
    published_for_opposition_date = Column(Date)
    amend_to_register_date = Column(Date)
    abandonment_date = Column(Date)
    cancellation_code = Column(String(1))
    cancellation_date = Column(Date)
    republished_12c_date = Column(Date)
    domestic_representative_name = Column(Text)
    attorney_docket_number = Column(String(255))
    attorney_name = Column(Text)
    principal_register_amended_in = Column(Boolean)
    supplemental_register_amended_in = Column(Boolean)
    trademark_in = Column(Boolean)
    collective_trademark_in = Column(Boolean)
    service_mark_in = Column(Boolean)
    collective_service_mark_in = Column(Boolean)
    collective_membership_mark_in = Column(Boolean)
    certification_mark_in = Column(Boolean)
    cancellation_pending_in = Column(Boolean)
    published_concurrent_in = Column(Boolean)
    concurrent_use_in = Column(Boolean)
    concurrent_use_proceeding_in = Column(Boolean)
    interference_pending_in = Column(Boolean)
    opposition_pending_in = Column(Boolean)
    section_12c_in = Column(Boolean)
    section_2f_in = Column(Boolean)
    section_2f_in_part_in = Column(Boolean)
    renewal_filed_in = Column(Boolean)
    section_8_filed_in = Column(Boolean)
    section_8_partial_accept_in = Column(Boolean)
    section_8_accepted_in = Column(Boolean)
    section_15_acknowledged_in = Column(Boolean)
    section_15_filed_in = Column(Boolean)
    supplemental_register_in = Column(Boolean)
    foreign_priority_in = Column(Boolean)
    change_registration_in = Column(Boolean)
    intent_to_use_in = Column(Boolean)
    intent_to_use_current_in = Column(Boolean)
    filed_as_use_application_in = Column(Boolean)
    amended_to_use_application_in = Column(Boolean)
    use_application_currently_in = Column(Boolean)
    amended_to_itu_application_in = Column(Boolean)
    filing_basis_filed_as_44d_in = Column(Boolean)
    amended_to_44d_application_in = Column(Boolean)
    filing_basis_current_44d_in = Column(Boolean)
    filing_basis_filed_as_44e_in = Column(Boolean)
    amended_to_44e_application_in = Column(Boolean)
    filing_basis_current_44e_in = Column(Boolean)
    without_basis_currently_in = Column(Boolean)
    filing_current_no_basis_in = Column(Boolean)
    color_drawing_filed_in = Column(Boolean)
    color_drawing_current_in = Column(Boolean)
    drawing_3d_filed_in = Column(Boolean)
    drawing_3d_current_in = Column(Boolean)
    standard_characters_claimed_in = Column(Boolean)
    filing_basis_filed_as_66a_in = Column(Boolean)
    filing_basis_current_66a_in = Column(Boolean)
    renewal_date = Column(Date)
    law_office_assigned_location_code = Column(String(255))
    current_location = Column(String(255))
    location_date = Column(Date)
    employee_name = Column(String(255))
    mark_identification_soundex = Column(ARRAY(Text))

    case_file = relationship("CaseFile", back_populates="header") # Correct

class CaseFileStatement(Base):
    __tablename__ = 'casefilestatement'

    case_file_statement_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    type_code = Column(String(6))
    statement_text = Column(Text)

    case_file = relationship("CaseFile", back_populates="statements") # Correct

class CaseFileEventStatement(Base):
    __tablename__ = 'casefileeventstatement'

    case_file_event_statement_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    event_code = Column(String(4))
    event_type = Column(String(1))
    description_text = Column(Text)
    event_date = Column(Date)
    event_number = Column(Integer)

    case_file = relationship("CaseFile", back_populates="event_statements") # Correct

class PriorRegistrationApplication(Base):
    __tablename__ = 'priorregistrationapplication'

    prior_registration_application_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    other_related_in = Column(Boolean)
    relationship_type = Column(String(1))
    number = Column(String(8))

    case_file = relationship("CaseFile", back_populates="prior_registrations") # Correct

class ForeignApplication(Base):
    __tablename__ = 'foreignapplication'

    foreign_application_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    foreign_filing_date = Column(Date)
    foreign_registration_date = Column(Date)
    registration_expiration_date = Column(Date)
    registration_renewal_date = Column(Date)
    registration_renewal_expiration_date = Column(Date)
    foreign_application_entry_number = Column(Integer)
    application_number = Column(String(12))
    foreign_country = Column(String(2))
    foreign_other = Column(String(3))
    foreign_registration_number = Column(String(12))
    renewal_number = Column(String(12))
    foreign_priority_claim_in = Column(Boolean)

    case_file = relationship("CaseFile", back_populates="foreign_applications") # Correct

class Classification(Base):
    __tablename__ = 'classification'

    classification_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    international_code_total_no = Column(Integer)
    us_code_total_no = Column(Integer)
    international_code = Column(String(3))
    us_code = Column(String(3))
    classification_status_code = Column(String(1))
    classification_status_date = Column(Date)
    first_use_anywhere_date = Column(Date)
    first_use_in_commerce_date = Column(Date)
    primary_code = Column(String(3))

    case_file = relationship("CaseFile", back_populates="classifications") # Correct

class Correspondent(Base):
    __tablename__ = 'correspondent'

    correspondent_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    address_1 = Column(Text)
    address_2 = Column(Text)
    address_3 = Column(Text)
    address_4 = Column(Text)
    address_5 = Column(Text)

    case_file = relationship("CaseFile", back_populates="correspondents") # Correct

class Owner(Base):
    __tablename__ = 'owner'

    owner_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    owner_entry_number = Column(Integer)
    party_type = Column(Integer)
    nationality_country = Column(String(3))
    nationality_state = Column(String(2))
    nationality_other = Column(String(3))
    legal_entity_type_code = Column(Integer)
    entity_statement = Column(Text)
    party_name = Column(Text)
    owner_address_1 = Column(Text)
    owner_address_2 = Column(Text)
    city = Column(String(40))
    owner_state = Column(String(2))
    owner_country = Column(String(3))
    owner_other = Column(String(3))
    postcode = Column(String(15))
    dba_aka_text = Column(Text)
    composed_of_statement = Column(Text)
    name_change_explanation = Column(Text)

    case_file = relationship("CaseFile", back_populates="owners") # Correct

class DesignSearch(Base):
    __tablename__ = 'designsearch'

    design_search_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    design_search_code = Column(Integer)

    case_file = relationship("CaseFile", back_populates="design_searches") # Correct

class InternationalRegistration(Base):
    __tablename__ = 'internationalregistration'

    international_registration_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    international_registration_number = Column(Integer)
    international_registration_date = Column(Date)
    international_publication_date = Column(Date)
    international_renewal_date = Column(Date)
    auto_protection_date = Column(Date)
    international_death_date = Column(Date)
    international_status_code = Column(Integer)
    international_status_date = Column(Date)
    priority_claimed_in = Column(Boolean)
    priority_claimed_date = Column(Date)
    first_refusal_in = Column(Boolean)
    notification_date = Column(Date)

    case_file = relationship("CaseFile", back_populates="international_registrations") # Correct

class MadridInternationalFilingRequest(Base):
    __tablename__ = 'madridinternationalfilingrequest'

    madrid_international_filing_id = Column(Integer, primary_key=True)
    serial_number = Column(Integer, ForeignKey('casefile.serial_number', ondelete="CASCADE"))
    madrid_filing_entry_number = Column(Integer)
    reference_number = Column(Integer)
    original_filing_date_uspto = Column(Date)
    madrid_international_registration_number = Column(String(10))
    madrid_international_registration_date = Column(Date)
    madrid_international_filing_status_code = Column(Integer)
    madrid_international_filing_status_date = Column(Date)
    irregularity_reply_by_date = Column(Date)
    madrid_international_filing_renewal_date = Column(Date)

    case_file = relationship("CaseFile", back_populates="madrid_filings") # Correct
    history_events = relationship("MadridHistoryEvent", back_populates="filing_request", cascade="all, delete") # Correct

class MadridHistoryEvent(Base):
    __tablename__ = 'madridhistoryevent'

    madrid_history_event_id = Column(Integer, primary_key=True)
    madrid_international_filing_id = Column(Integer, ForeignKey('madridinternationalfilingrequest.madrid_international_filing_id', ondelete="CASCADE"))
    madrid_history_event_code = Column(Text)
    madrid_history_event_date = Column(Date)
    event_description_text = Column(Text)
    madrid_history_entry_number = Column(Integer)

    filing_request = relationship("MadridInternationalFilingRequest", back_populates="history_events") # Correct