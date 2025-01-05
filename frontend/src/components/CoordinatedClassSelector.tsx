'use client'

import { useState, useEffect } from 'react'

const COORDINATED_CLASS_CONFIG = {
  coord_class_001: {
    intl_classes: ['005', '017', '035', '042', '044'],
    us_classes: ['A', 'B', '200']
  },
  coord_class_002: {
    intl_classes: ['017', '019', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_003: {
    intl_classes: ['005', '021', '035', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_004: {
    intl_classes: ['001', '035', '037', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_005: {
    intl_classes: ['001', '003', '010', '035', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_006: {
    intl_classes: ['011', '017', '019', '020', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_007: {
    intl_classes: ['008', '011', '012', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_008: {
    intl_classes: ['007', '021', '035', '037', '040', '042', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_009: {
    intl_classes: ['010', '016', '028', '035', '038', '041', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_010: {
    intl_classes: ['005', '035', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_011: {
    intl_classes: ['006', '007', '009', '019', '020', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_012: {
    intl_classes: ['007', '035', '037', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_013: {
    intl_classes: ['028', '035', '042', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_014: {
    intl_classes: ['025', '026', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_015: {
    intl_classes: ['028', '035', '041', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_016: {
    intl_classes: ['009', '035', '041', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_017: {
    intl_classes: ['001', '002', '006', '019', '035', '037', '040', '042'],
    us_classes: ['A', 'B', '200']
  },
  coord_class_018: {
    intl_classes: ['014', '025', '035', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_019: {
    intl_classes: ['002', '006', '011', '017', '035', '037', '040', '042'],
    us_classes: ['A', 'B', '200']
  },
  coord_class_020: {
    intl_classes: ['006', '021', '028', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_021: {
    intl_classes: ['003', '008', '020', '035', '042', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_022: {
    intl_classes: ['023', '024', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_023: {
    intl_classes: ['022', '024', '026', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_024: {
    intl_classes: ['023', '025', '026', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_025: {
    intl_classes: ['014', '018', '024', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_026: {
    intl_classes: ['023', '024', '035', '041'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_027: {
    intl_classes: ['019', '024', '035', '037', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_028: {
    intl_classes: ['009', '016', '020', '025', '035', '041', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_029: {
    intl_classes: ['005', '030', '031', '032', '033', '035', '042', '043'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_030: {
    intl_classes: ['001', '005', '029', '031', '032', '033', '035', '042', '043'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_031: {
    intl_classes: ['005', '029', '030', '032', '035', '042', '043', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_032: {
    intl_classes: ['005', '029', '030', '031', '033', '035', '042', '043'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_033: {
    intl_classes: ['005', '029', '030', '031', '032', '035', '042', '043'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_034: {
    intl_classes: ['004', '035', '042'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_035: {
    intl_classes: ['036', '037', '038', '039', '040', '041', '042', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_036: {
    intl_classes: ['035', '037', '038', '039', '040', '041', '042', '043', '044'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_037: {
    intl_classes: ['035', '036', '038', '039', '040', '041', '042', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_038: {
    intl_classes: ['035', '036', '037', '039', '040', '041', '042', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_039: {
    intl_classes: ['035', '036', '037', '038', '040', '041', '042', '043', '044', '045'],   
    us_classes: ['A', 'B', '200']
  },
  coord_class_040: {
    intl_classes: ['035', '036', '037', '038', '039', '041', '042', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_041: {
    intl_classes: ['035', '036', '037', '038', '039', '040', '042', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_042: {
    intl_classes: ['035', '036', '037', '038', '039', '040', '041', '043', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_043: {
    intl_classes: ['035', '036', '037', '038', '039', '040', '041', '042', '044', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_044: {
    intl_classes: ['035', '036', '037', '038', '039', '040', '041', '042', '043', '045'], 
    us_classes: ['A', 'B', '200']
  },
  coord_class_045: {
    intl_classes: ['035', '036', '037', '038', '039', '040', '041', '042', '043', '044'],
    us_classes: ['A', 'B', '200']
  }
}

interface CoordinatedClassSelectorProps {
  onSelectionChange: (selectedClasses: string[]) => void
}

export default function CoordinatedClassSelector({ onSelectionChange }: CoordinatedClassSelectorProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])

  useEffect(() => {
    onSelectionChange(selectedClasses)
  }, [selectedClasses, onSelectionChange])

  const toggleClass = (coordClass: string) => {
    setSelectedClasses(prev => {
      if (prev.includes(coordClass)) {
        return prev.filter(c => c !== coordClass)
      } else {
        return [...prev, coordClass]
      }
    })
  }

  const isSelected = (coordClass: string) => selectedClasses.includes(coordClass)

  const getAssociatedClasses = (coordClass: string) => {
    const config = COORDINATED_CLASS_CONFIG[coordClass as keyof typeof COORDINATED_CLASS_CONFIG]
    return config ? [...config.intl_classes, ...config.us_classes] : []
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Coordinated Classes</h4>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {Object.keys(COORDINATED_CLASS_CONFIG).map((coordClass) => (
          <button
            key={coordClass}
            onClick={() => toggleClass(coordClass)}
            className={`p-2 text-sm rounded-md transition-colors ${
              isSelected(coordClass)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {coordClass.split('_')[2]}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <h5 className="font-medium mb-2">Associated Classes:</h5>
        <div className="flex flex-wrap gap-2">
          {selectedClasses.flatMap(getAssociatedClasses).map((cls) => (
            <span key={cls} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
              {cls}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

