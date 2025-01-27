// /app/case/[serialNumber]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CaseDetails from '@/components/searchpage/CaseDetails'
import { API_ENDPOINTS } from '@/lib/api-config'
import { Loader2 } from 'lucide-react'
import { Case } from '@/utils/types/case'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Search</Link>
        <Button
          onClick={() => window.open(`/ai-chat/${params.serialNumber}`, '_blank')}
          className="flex items-center gap-2"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4" />
          Chat with AI about this case
        </Button>
      </div>
      <CaseDetails case={caseData} />
    </div>
  )
} 