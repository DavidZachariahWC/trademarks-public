'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CaseDetails from '@/components/CaseDetails'
import { API_ENDPOINTS } from '@/lib/api-config'
import { Loader2 } from 'lucide-react'
import { Case } from '@/types/case'
import Link from 'next/link'

export default function CasePage() {
  const params = useParams()
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.caseDetails(Number(params.serialNumber)))
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Case not found')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCaseData(data)
      } catch (error) {
        console.error('Failed to fetch case details:', error)
        setError(error instanceof Error ? error.message : 'Failed to load case details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.serialNumber) {
      fetchCaseDetails()
    }
  }, [params.serialNumber])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-block mb-6 text-blue-600 hover:underline">← Back to Search</Link>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return null
  }

  return <CaseDetails case={caseData} />
} 