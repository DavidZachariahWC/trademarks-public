interface Owner {
  party_type: number
  owner_entry_number: number
  party_name: string
  owner_address_1: string
  owner_address_2?: string
  city?: string
  owner_state?: string
  postcode?: string
  owner_country?: string
  owner_other?: string
  dba_aka_text?: string
  entity_statement?: string
  composed_of_statement?: string
  name_change_explanation?: string
  nationality_country?: string
  nationality_state?: string
  nationality_other?: string
  legal_entity_type_code: number
}

interface PartyType {
  code: number
  description: string
  category: 'before_publication' | 'at_publication' | 'after_publication' | 'after_registration' | 'original'
  sequence?: number // For ordering within a category
}

export const partyTypes: Record<number, PartyType> = {
  10: { 
    code: 10, 
    description: 'Original Applicant',
    category: 'original'
  },
  11: { 
    code: 11, 
    description: '1st New Owner Before Publication',
    category: 'before_publication',
    sequence: 1
  },
  12: { 
    code: 12, 
    description: '2nd New Owner Before Publication',
    category: 'before_publication',
    sequence: 2
  },
  13: { 
    code: 13, 
    description: '3rd New Owner Before Publication',
    category: 'before_publication',
    sequence: 3
  },
  14: { 
    code: 14, 
    description: '4th New Owner Before Publication',
    category: 'before_publication',
    sequence: 4
  },
  15: { 
    code: 15, 
    description: '5th New Owner Before Publication',
    category: 'before_publication',
    sequence: 5
  },
  16: { 
    code: 16, 
    description: '6th New Owner Before Publication',
    category: 'before_publication',
    sequence: 6
  },
  17: { 
    code: 17, 
    description: '7th New Owner Before Publication',
    category: 'before_publication',
    sequence: 7
  },
  18: { 
    code: 18, 
    description: '8th New Owner Before Publication',
    category: 'before_publication',
    sequence: 8
  },
  19: { 
    code: 19, 
    description: '9th New Owner Before Publication',
    category: 'before_publication',
    sequence: 9
  },
  20: { 
    code: 20, 
    description: 'Owner at Publication',
    category: 'at_publication'
  },
  21: { 
    code: 21, 
    description: '1st New Owner After Publication',
    category: 'after_publication',
    sequence: 1
  },
  22: { 
    code: 22, 
    description: '2nd New Owner After Publication',
    category: 'after_publication',
    sequence: 2
  },
  23: { 
    code: 23, 
    description: '3rd New Owner After Publication',
    category: 'after_publication',
    sequence: 3
  },
  24: { 
    code: 24, 
    description: '4th New Owner After Publication',
    category: 'after_publication',
    sequence: 4
  },
  25: { 
    code: 25, 
    description: '5th New Owner After Publication',
    category: 'after_publication',
    sequence: 5
  },
  26: { 
    code: 26, 
    description: '6th New Owner After Publication',
    category: 'after_publication',
    sequence: 6
  },
  27: { 
    code: 27, 
    description: '7th New Owner After Publication',
    category: 'after_publication',
    sequence: 7
  },
  28: { 
    code: 28, 
    description: '8th New Owner After Publication',
    category: 'after_publication',
    sequence: 8
  },
  29: { 
    code: 29, 
    description: '9th New Owner After Publication',
    category: 'after_publication',
    sequence: 9
  },
  30: { 
    code: 30, 
    description: 'Original Registrant',
    category: 'original'
  },
  40: { 
    code: 40, 
    description: '1st New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 1
  },
  41: { 
    code: 41, 
    description: '2nd New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 2
  },
  42: { 
    code: 42, 
    description: '3rd New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 3
  },
  43: { 
    code: 43, 
    description: '4th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 4
  },
  44: { 
    code: 44, 
    description: '5th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 5
  },
  45: { 
    code: 45, 
    description: '6th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 6
  },
  46: { 
    code: 46, 
    description: '7th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 7
  },
  47: { 
    code: 47, 
    description: '8th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 8
  },
  48: { 
    code: 48, 
    description: '9th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 9
  },
  49: { 
    code: 49, 
    description: '10th New Owner Entered After Registration',
    category: 'after_registration',
    sequence: 10
  }
}

// Helper functions for ownership analysis
export function getCurrentOwners(owners: Owner[]): Owner[] {
  if (!owners || owners.length === 0) {
    return []
  }
  
  // Get all party types and find the maximum
  const partyTypes = owners.map(owner => owner.party_type)
  const maxPartyType = Math.max(...partyTypes)
  
  // Get all owners with the maximum party type
  const currentOwners = owners.filter(owner => owner.party_type === maxPartyType)
    .sort((a, b) => a.owner_entry_number - b.owner_entry_number)
    
  return currentOwners
}

export function getOwnershipHistory(owners: Owner[]): Owner[] {
  if (!owners || owners.length === 0) {
    return []
  }
  
  // Sort in reverse chronological order (latest first)
  return [...owners].sort((a, b) => {
    // First sort by party type in reverse order
    if (a.party_type !== b.party_type) {
      return b.party_type - a.party_type
    }
    // Then by entry number within same party type
    return b.owner_entry_number - a.owner_entry_number
  })
}

export function areCoOwners(owners: Owner[]): boolean {
  const currentOwners = getCurrentOwners(owners)
  return currentOwners.length > 1
}

export function getOwnershipCategory(partyType: number): string {
  return partyTypes[partyType]?.category || 'unknown'
}

export function formatOwnershipDate(owner: Owner): string {
  // This should be implemented based on how dates are stored in the Owner object
  // For example:
  // return owner.ownership_date ? format(new Date(owner.ownership_date), 'MM/dd/yyyy') : 'N/A'
  return 'N/A' // Placeholder
} 