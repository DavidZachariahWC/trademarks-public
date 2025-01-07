// format.ts
export function formatDate(date: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A'
  
  try {
    // Split the date string and parse as numbers
    const [year, month, day] = date.split('-').map(Number)
    
    // Validate date components
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return 'Invalid Date'
    }
    
    // Create date using UTC to avoid timezone shifts
    const dateObj = new Date(Date.UTC(year, month - 1, day))
    
    // Validate the resulting date
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    
    // Use Intl.DateTimeFormat with UTC timezone to ensure consistent display
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    }).format(dateObj)
  } catch (error) {
    return 'Invalid Date'
  }
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return 'N/A'
  return value ? 'Yes' : 'No'
}

export function formatAttorneys(attorneys: string | null): string {
  if (!attorneys) return 'N/A'
  return attorneys.split(';').map(attorney => attorney.trim()).join('; ')
}

export function getDrawingCodeDescription(code: string): string {
  if (!code) return 'Not yet assigned'
  const firstDigit = code[0]
  switch (firstDigit) {
    case '0': return 'Not yet assigned'
    case '1': return 'Typeset word(s)/letter(s)/number(s)'
    case '2': return 'Design without text'
    case '3': return 'Design with text'
    case '4': return 'Standard character mark'
    case '5': return 'Stylized text with design'
    case '6': return 'No drawing (e.g., sound)'
    default: return 'Unknown'
  }
}

export function getRelationshipTypeDescription(type: string): string {
  switch (type) {
    case '1': return 'Child Case'
    case '2': return 'Parent Case'
    case '3': return 'Cross Reference'
    default: return type
  }
}

export function getAcquiredDistinctiveness(section2f: boolean, section2fInPart: boolean): string {
  if (section2f) return 'In whole'
  if (section2fInPart) return 'In part'
  return 'No'
} 