// api-config.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export const API_ENDPOINTS = {
  search: '/api/search',
  autocomplete: '/api/autocomplete',
  caseDetails: (serialNumber: string | number) => `/api/case/${serialNumber}`,
  combinedSearch: '/api/combined-search',
  exportSearch: '/api/export-search',
  aiChat: '/api/ai-chat',
  wordmarkGenerator: '/api/wordmark-generator'
} as const 