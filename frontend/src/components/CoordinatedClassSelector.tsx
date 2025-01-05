'use client'

import { useState, useEffect } from 'react'

const COORDINATED_CLASS_CONFIG = {
  coord_class_001: {
    intl_classes: ['005', '017', '035', '042', '044'],
    us_classes: ['A', 'B', '200']
  },
  // ... (include all other coordinated classes here)
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

