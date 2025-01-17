export const classificationStatusCodes: { [key: string]: string } = {
  '1': 'Sec. 7(e) – Entire Registration',
  'A': 'Sec. 7(e) – Class(es) in a Multiple Class Registration; Cancelled',
  '2': 'Sec. 8 – Entire Registration',
  'B': 'Sec. 8 – Class(es) in a Multiple Class registration; Cancelled ',
  '3': 'Sec. 18 – Entire Registration',
  'C': 'Sec. 18 – Class(es) in a Multiple Class Registration; Cancelled ',
  '4': 'Sec. 24 – Entire Registration',
  'D': 'Sec. 24 – Class(es) in a Multiple Class Registration; Cancelled',
  '5': 'Sec. 37 – Entire Registration',
  'E': 'Sec. 37 - Class(es) in a Multiple Class Registration; Cancelled',
  '6': 'Active',
  '7': 'Inactive – Insufficient fee received',
  '8': 'Abandoned',
  '9': 'Expired',
  'F': 'SECTION 71 - CANCELLED Entire Registration',
  'G': 'SECTION 71 - CANCELLED Classes in a Multiple Class Registration',
  'H': 'SECTION 70 - CANCELLED',
  'K': 'SECTION 16B - CANCELLED',
  'J': 'SECTION 16A - CANCELLED',
  'P': 'PARTIALLY PAID',
  'W': 'FEE WAIVED',
  'X': 'TERMINATED'
}

export function getClassificationStatusDescription(code: string): string {
  return classificationStatusCodes[code] || code;
} 