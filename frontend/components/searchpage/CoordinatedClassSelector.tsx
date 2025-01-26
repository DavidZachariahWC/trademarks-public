'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

type CoordinatedClassConfig = {
  [key: string]: {
    intl_classes: string[]
    us_classes: string[]
  }
}

const COORDINATED_CLASS_CONFIG: CoordinatedClassConfig = {
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
  onSelect: (classes: string[]) => void;
}

export default function CoordinatedClassSelector({ onSelect }: CoordinatedClassSelectorProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const isValidClass = (num: string) => {
    const coordClass = `coord_class_${num}`
    return coordClass in COORDINATED_CLASS_CONFIG
  }

  const getAssociatedClasses = (num: string): string[] => {
    const coordClass = `coord_class_${num}`
    if (!COORDINATED_CLASS_CONFIG[coordClass]) return []
    return COORDINATED_CLASS_CONFIG[coordClass].intl_classes
  }

  const handleClassSelect = (num: string) => {
    if (!isValidClass(num)) return
    setSelectedClass(num === selectedClass ? null : num)
    onSelect(num === selectedClass ? [] : [num])
  }

  const getButtonStyle = (num: string) => {
    const isValid = isValidClass(num)
    const isPrimary = selectedClass === num
    const isAssociated = selectedClass && getAssociatedClasses(selectedClass).includes(num.padStart(3, '0'))

    if (!isValid) return 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
    if (isPrimary) return 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600'
    if (isAssociated) return 'bg-purple-200 border-purple-300 text-purple-800 hover:bg-purple-300'
    return 'bg-white hover:bg-purple-100 hover:border-purple-400 border-gray-200'
  }

  const renderUSClassButton = (usClass: string, tooltip: string) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={`
              p-2 rounded border text-center transition-all w-full
              ${selectedClass ? 'bg-purple-200 border-purple-300 text-purple-800' : 'bg-gray-100 border-gray-200 text-gray-400'}
              cursor-help
            `}
          >
            {usClass}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-800 text-white p-2 rounded text-sm max-w-xs"
            sideOffset={5}
          >
            {tooltip}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 p-4">
        {Array.from({ length: 45 }, (_, i) => {
          const num = String(i + 1).padStart(3, '0')
          const isValid = isValidClass(num)

          return (
            <button
              key={num}
              onClick={() => handleClassSelect(num)}
              disabled={!isValid}
              className={`
                p-2 rounded border text-center transition-all
                ${getButtonStyle(num)}
              `}
            >
              {num}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 px-4">
        {renderUSClassButton('A', 'Used for certification marks that certify goods.')}
        {renderUSClassButton('B', 'Used for certification marks that certify services.')}
        {renderUSClassButton('200', 'Used for collective membership marks.')}
      </div>
    </div>
  )
}

