// CaseDetails.tsx
import React from 'react'
import { Case } from '@/utils/types/case'
import BasicInfo from './BasicInfo'
import OwnerInfo from './OwnerInfo'
import Classifications from './Classifications'
import GoodsServicesStatements from './GoodsServicesStatements'
import MarkDesignInfo from './MarkDesignInfo'
import ForeignFilingDates from './ForeignFilingDates'
import InternationalRegistration from './InternationalRegistration'
import PriorRegistrations from './PriorRegistrations'
import AllStatements from './AllStatements'
import ForeignApplications from './ForeignApplications'
import CorrespondentInfo from './CorrespondentInfo'
import EventStatements from './EventStatements'
import SectionStatus from './SectionStatus'
import MiscellaneousStatements from './MiscellaneousStatements'
import AttorneyOfRecord from './AttorneyOfRecord'
import RestrictionOnScope from './RestrictionOnScope'
import PseudoMarks from './PseudoMarks'

interface CaseDetailsProps {
  case: Case
}

export default function CaseDetails({ case: caseData }: CaseDetailsProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <a href="/" className="inline-block mb-6 text-blue-600 hover:underline">← Back to Search</a>
      
      <div className="space-y-6">
        <BasicInfo caseData={caseData} />
        
        <SectionStatus header={caseData.header} />
        
        {caseData.classifications && caseData.classifications.length > 0 && (
          <Classifications 
            classifications={caseData.classifications} 
            statements={caseData.statements}
          />
        )}

        {caseData.statements && (
          <RestrictionOnScope statements={caseData.statements} />
        )}

        <MarkDesignInfo caseData={caseData} />
                
        {caseData.owners && caseData.owners.length > 0 && (
          <OwnerInfo owners={caseData.owners} />
        )}

        <AttorneyOfRecord 
          attorney_name={caseData.header.attorney_name}
          attorney_docket_number={caseData.header.attorney_docket_number}
          domestic_representative_name={caseData.header.domestic_representative_name}
        />
        
        {caseData.correspondents && caseData.correspondents.length > 0 && (
          <CorrespondentInfo correspondents={caseData.correspondents} />
        )}
        
        {caseData.statements && (
          <GoodsServicesStatements statements={caseData.statements} />
        )}
        
        {caseData.foreign_applications && caseData.foreign_applications.length > 0 && (
          <ForeignFilingDates foreignApplications={caseData.foreign_applications} />
        )}
        
        {caseData.international_registrations && caseData.international_registrations.length > 0 && (
          <InternationalRegistration registrations={caseData.international_registrations} />
        )}
        
        <PriorRegistrations priorRegistrations={caseData.prior_registrations} />

        {caseData.statements && (
          <PseudoMarks statements={caseData.statements} />
        )}

        {caseData.statements && (
          <MiscellaneousStatements statements={caseData.statements} />
        )}
        
        {caseData.statements && caseData.statements.length > 0 && (
          <AllStatements statements={caseData.statements} />
        )}
        
        {caseData.foreign_applications && caseData.foreign_applications.length > 0 && (
          <ForeignApplications 
            foreignApplications={caseData.foreign_applications}
            statements={caseData.statements}
          />
        )}
        
        {caseData.event_statements && caseData.event_statements.length > 0 && (
          <EventStatements eventStatements={caseData.event_statements} />
        )}

        <div className="flex justify-center">
          <a 
            href={`https://tsdr.uspto.gov/#caseNumber=${caseData.serial_number}&caseSearchType=US_APPLICATION&caseType=DEFAULT&searchType=statusSearch`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View on USPTO TSDR
          </a>
        </div>
      </div>
    </div>
  )
}

