import React from 'react'
import BasicInfo from './BasicInfo'
import OwnerInfo from './OwnerInfo'
import Classifications from './Classifications'
import GoodsServicesStatements from './GoodsServicesStatements'
import MarkDesignInfo from './MarkDesignInfo'
import DisclaimerStatements from './DisclaimerStatements'
import ForeignFilingDates from './ForeignFilingDates'
import InternationalRegistration from './InternationalRegistration'
import PriorRegistrations from './PriorRegistrations'
import AllStatements from './AllStatements'
import ForeignApplications from './ForeignApplications'
import MarkInformation from './MarkInformation'

interface CaseDetailsProps {
  case: any // Replace 'any' with a proper type definition for your case object
}

export default function CaseDetails({ case: caseData }: CaseDetailsProps) {
  return (
    <div className="case-details max-w-6xl mx-auto px-4 py-8">
      <a href="/" className="inline-block mb-6 text-blue-600 hover:underline">← Back to Search</a>
      
      <BasicInfo caseData={caseData} />
      
      {caseData.owners && <OwnerInfo owners={caseData.owners} />}
      
      {caseData.classifications && <Classifications classifications={caseData.classifications} />}
      
      <GoodsServicesStatements statements={caseData.statements} />
      
      <MarkDesignInfo caseData={caseData} />
      
      {caseData.statements && <DisclaimerStatements statements={caseData.statements} />}
      
      {caseData.foreign_applications && <ForeignFilingDates foreignApplications={caseData.foreign_applications} />}
      
      {caseData.international_registrations && <InternationalRegistration registrations={caseData.international_registrations} />}
      
      <PriorRegistrations priorRegistrations={caseData.prior_registrations} />
      
      {caseData.statements && <AllStatements statements={caseData.statements} />}
      
      <ForeignApplications foreignApplications={caseData.foreign_applications} />
      
      <MarkInformation caseData={caseData} />
    </div>
  )
}

