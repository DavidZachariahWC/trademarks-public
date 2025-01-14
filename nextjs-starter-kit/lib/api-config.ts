// api-config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/api/search`,
  autocomplete: `${API_BASE_URL}/api/autocomplete`,
  caseDetails: (serialNumber: number) => `${API_BASE_URL}/api/case/${serialNumber}`,
  combinedSearch: `${API_BASE_URL}/api/combined_search`
}; 