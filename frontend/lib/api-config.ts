// api-config.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export const API_ENDPOINTS = {
  search: `${API_BASE}/search`,
  autocomplete: `${API_BASE}/autocomplete`,
  caseDetails: (serialNumber: string | number) => `${API_BASE}/case/${serialNumber}`,
  combinedSearch: `${API_BASE}/combined_search`,
  exportSearch: `${API_BASE}/export_search`,
  aiChat: `${API_BASE}/ai-chat`,
  wordmarkGenerator: '/api/wordmark-generator'
} as const 