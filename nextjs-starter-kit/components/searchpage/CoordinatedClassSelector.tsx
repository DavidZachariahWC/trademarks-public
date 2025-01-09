'use client'

import * as React from 'react'

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
  }
}

interface CoordinatedClassSelectorProps {
  onClassSelect: (classes: string[]) => void
}

const CoordinatedClassSelector = ({ onClassSelect }: CoordinatedClassSelectorProps) => {
  const [selectedClass, setSelectedClass] = React.useState<string>('')

  React.useEffect(() => {
    if (selectedClass) {
      const config = COORDINATED_CLASS_CONFIG[selectedClass]
      if (config) {
        onClassSelect([...config.intl_classes])
      }
    }
  }, [selectedClass, onClassSelect])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value)
  }

  return (
    <div className="mb-4">
      <label htmlFor="coordinated-class" className="block text-sm font-medium text-gray-700 mb-2">
        Select Coordinated Class
      </label>
      <select
        id="coordinated-class"
        value={selectedClass}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select a class...</option>
        {Object.keys(COORDINATED_CLASS_CONFIG).map((key) => (
          <option key={key} value={key}>
            {key.replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CoordinatedClassSelector

