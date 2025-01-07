// api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const API_ENDPOINTS = {
  search: `${API_BASE}/search`,
  autocomplete: `${API_BASE}/autocomplete`,
  case: (serialNumber: string | number) => `${API_BASE}/case/${serialNumber}`,
  combinedSearch: `${API_BASE}/combined_search`
} 