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
import MarkInformation from './MarkInformation'
import CorrespondentInfo from './CorrespondentInfo'
import EventStatements from './EventStatements'
import SectionStatus from './SectionStatus'

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

        <MarkDesignInfo caseData={caseData} />
        
        <MarkInformation caseData={caseData} />
        
        {caseData.owners && caseData.owners.length > 0 && (
          <OwnerInfo owners={caseData.owners} />
        )}
        
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
        
        {caseData.statements && caseData.statements.length > 0 && (
          <AllStatements statements={caseData.statements} />
        )}
        
        {caseData.foreign_applications && caseData.foreign_applications.length > 0 && (
          <ForeignApplications foreignApplications={caseData.foreign_applications} />
        )}
        
        {caseData.event_statements && caseData.event_statements.length > 0 && (
          <EventStatements eventStatements={caseData.event_statements} />
        )}
      </div>
    </div>
  )
}

