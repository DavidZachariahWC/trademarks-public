'use client'

import { useState, useEffect, useRef } from 'react'
import { Filter, QueryPart, ClassificationOption, CoordinatedClassConfig } from './types/search'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, ChevronRight, Search } from 'lucide-react'
import { SearchResults } from './search-results'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const filters: Filter[] = [
  { id: 'name', name: 'Name', type: 'text' },
  { id: 'age', name: 'Age', type: 'text' },
  { id: 'isActive', name: 'Is Active', type: 'boolean' },
  { id: 'hasSubscription', name: 'Has Subscription', type: 'boolean' },
  { id: 'country', name: 'Country', type: 'text' },
  { id: 'section12c', name: 'Section 12c filed', type: 'boolean', section: 'Filing Status' },
  { id: 'section8', name: 'Section 8 filed', type: 'boolean', section: 'Filing Status' },
  { id: 'coordinatedClass', name: 'Coordinated Class', type: 'coordinated_classification', section: 'Classification' },
  { id: 'usClass', name: 'US Class', type: 'classification', section: 'Classification' },
  { id: 'internationalClass', name: 'International Class', type: 'classification', section: 'Classification' },
]

const internationalClasses: ClassificationOption[] = Array.from({ length: 45 }, (_, i) => ({
  id: `00${i + 1}`.slice(-3),
  name: `${i + 1}`,
}))

const usClasses: ClassificationOption[] = [
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: '200', name: '200' },
]

const COORDINATED_CLASS_CONFIG: CoordinatedClassConfig = {
  coord_class_001: {
    intl_classes: ['005', '017', '035', '042', '044'],
    us_classes: ['A', 'B', '200']
  },
  coord_class_002: {
    intl_classes: ['017', '019', '035', '037', '040', '042'], 
    us_classes: ['A', 'B', '200']
  },
}

export default function SearchQueryBuilder() {
  const [query, setQuery] = useState<QueryPart[]>([])
  const [currentFilter, setCurrentFilter] = useState<Filter>(filters[0])
  const [currentValue, setCurrentValue] = useState<string>('')
  const [currentOperator, setCurrentOperator] = useState<'AND' | 'OR'>('AND')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showClassChart, setShowClassChart] = useState(false)
  const [useCoordinatedClass, setUseCoordinatedClass] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [inputError, setInputError] = useState(false) // Added inputError state

  useEffect(() => {
    // Initialize with default "Name" filter
    setQuery([{ filterId: 'name', value: '', operator: null }])
  }, [])

  const addToQuery = () => {
    if (currentFilter && (currentFilter.type === 'boolean' || (currentValue && currentValue.trim() !== ''))) {
      const newPart: QueryPart = {
        filterId: currentFilter.id,
        value: currentFilter.type === 'boolean' ? true : currentValue,
        operator: query.length === 0 ? null : currentOperator,
      }
      if (editingIndex !== null) {
        const newQuery = [...query]
        newQuery[editingIndex] = newPart
        setQuery(newQuery)
        setEditingIndex(null)
      } else {
        setQuery([...query, newPart])
      }
      setCurrentValue('')
      setShowClassChart(false)
      setSelectedClasses([])
      setInputError(false)
      flashQueryGreen()
    } else {
      setInputError(true)
      flashQueryRed()
    }
  }

  const removeFromQuery = (index: number) => {
    const newQuery = query.filter((_, i) => i !== index)
    setQuery(newQuery)
  }

  const toggleOperator = () => {
    setCurrentOperator(prev => prev === 'AND' ? 'OR' : 'AND')
  }

  const conductSearch = () => {
    if (currentFilter && (currentFilter.type === 'boolean' || currentValue)) {
      addToQuery()
    }
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
    }, 2000)
  }

  const handleClassSelection = (classId: string) => {
    if (useCoordinatedClass && currentFilter.type === 'coordinated_classification') {
      const coordClass = Object.entries(COORDINATED_CLASS_CONFIG).find(([key, _]) => key === `coord_class_${classId}`)
      if (coordClass) {
        const [_, { intl_classes, us_classes }] = coordClass
        const allClasses = [classId, ...intl_classes, ...us_classes]
        setSelectedClasses(allClasses)
        setCurrentValue(`${classId}: ${allClasses.join(', ')}`)
      }
    } else {
      if (usClasses.some(c => c.id === classId)) {
        setCurrentFilter(filters.find(f => f.id === 'usClass') || currentFilter)
      }
      if (selectedClasses.includes(classId)) {
        setSelectedClasses(selectedClasses.filter(id => id !== classId))
      } else {
        setSelectedClasses([...selectedClasses, classId])
      }
      setCurrentValue(selectedClasses.join(', '))
    }
  }

  const flashQueryRed = () => {
    const queryElement = document.getElementById('current-query')
    if (queryElement) {
      queryElement.classList.add('flash-red')
      setTimeout(() => {
        queryElement.classList.remove('flash-red')
      }, 500)
    }
  }

  const flashQueryGreen = () => {
    const queryElement = document.getElementById('current-query')
    if (queryElement) {
      queryElement.classList.add('flash-green')
      setTimeout(() => {
        queryElement.classList.remove('flash-green')
      }, 500)
    }
  }

  const renderQueryPart = (part: QueryPart, index: number, isPreview: boolean = false) => (
    <div key={index} className="flex items-center gap-3 flex-wrap bg-white p-3 rounded-md border border-gray-200">
      {index > 0 && (
        <Badge 
          variant="secondary" 
          className={`text-base font-bold px-3 py-1 ${
            part.operator === 'AND' ? 'bg-blue-100' : 'bg-green-100'
          }`}
        >
          {part.operator}
        </Badge>
      )}
      <Badge variant="outline" className="text-base font-medium px-3 py-1">
        {filters.find(f => f.id === part.filterId)?.name}
      </Badge>
      {typeof part.value === 'boolean' ? (
        <Badge variant="secondary" className="text-base font-medium px-3 py-1 bg-yellow-100">
          IS TRUE
        </Badge>
      ) : part.filterId === 'coordinatedClass' ? (
        <>
          <span className="px-2">=</span>
          <span className="italic bg-gray-100 px-3 py-1 rounded-md text-base">
            {part.value.split(':')[0]} <span className="font-bold">:</span> {part.value.split(':')[1]}
          </span>
        </>
      ) : (
        <>
          <span className="px-2">=</span>
          <span 
            className="italic bg-gray-100 px-3 py-1 rounded-md text-base cursor-pointer hover:bg-gray-200"
            onClick={() => {
              if (!isPreview) {
                setEditingIndex(index)
                setCurrentFilter(filters.find(f => f.id === part.filterId) || filters[0])
                setCurrentValue(part.value.toString())
                if (part.filterId === 'internationalClass' || part.filterId === 'usClass' || part.filterId === 'coordinatedClass') {
                  setShowClassChart(true)
                  setSelectedClasses(part.value.toString().split(', '))
                }
              }
            }}
          >
            {part.value || '(empty)'}
          </span>
        </>
      )}
      {!isPreview && (
        <Button variant="ghost" size="icon" onClick={() => removeFromQuery(index)} className="ml-auto">
          <X className="h-5 w-5" />
          <span className="sr-only">Remove</span>
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center space-y-10">
      <div className="w-full max-w-4xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Federal Trademark Database Search
        </h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {query.length > 0 && (
            <Button
              variant="outline"
              className={`w-28 h-12 text-lg font-semibold ${
                currentOperator === 'AND' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200'
              }`}
              onClick={toggleOperator}
            >
              {currentOperator}
            </Button>
          )}
          
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-64 h-12 text-lg font-semibold justify-between">
                {currentFilter.name}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
              <ScrollArea className="h-[calc(100vh-4rem)] pr-4">
                {['General', 'Filing Status', 'Classification'].map((section) => (
                  <div key={section} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{section}</h3>
                    {filters.filter(f => f.section === section || (!f.section && section === 'General')).map((filter) => (
                      <Button
                        key={filter.id}
                        variant="ghost"
                        className="w-full justify-start text-left mb-2 text-lg"
                        onClick={() => {
                          setCurrentFilter(filter)
                          setIsSidebarOpen(false)
                          if (filter.type === 'boolean') {
                            setCurrentValue('true')
                          } else if (filter.type === 'classification' || filter.type === 'coordinated_classification') {
                            setShowClassChart(true)
                            setCurrentValue('')
                            setSelectedClasses([])
                            setUseCoordinatedClass(filter.type === 'coordinated_classification')
                          } else {
                            setCurrentValue('')
                          }
                        }}
                      >
                        {filter.name}{filter.type === 'boolean' ? ' = TRUE' : ''}
                      </Button>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {currentFilter.type === 'text' && (
            <div className="flex-1">
              <Input
                id="value-input"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="Enter value"
                className="w-full h-12 text-lg"
              />
            </div>
          )}

          {(currentFilter.type === 'classification' || currentFilter.type === 'coordinated_classification') && (
            <div className="flex-1">
              <Input
                id="value-input"
                value={currentValue}
                readOnly
                placeholder="Select classes"
                className="w-full h-12 text-lg bg-gray-100"
              />
            </div>
          )}

          <Button 
            onClick={addToQuery} 
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={currentFilter.type === 'text' && !currentValue}
          >
            <Plus className="h-5 w-5" />
            Confirm Condition
          </Button>
        </div>
      </div>

      {showClassChart && (
        <div className="w-full max-w-4xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {useCoordinatedClass ? 'Select Coordinated Class' : 'Select Individual Class'}
            </h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="coordinated-class"
                checked={useCoordinatedClass}
                onCheckedChange={(checked) => {
                  setUseCoordinatedClass(checked)
                  setCurrentFilter(filters.find(f => f.id === (checked ? 'coordinatedClass' : 'internationalClass')) || filters[0])
                  setCurrentValue('')
                  setSelectedClasses([])
                }}
              />
              <Label htmlFor="coordinated-class">Utilize Coordinated Class</Label>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {internationalClasses.map((classOption) => (
              <Button
                key={classOption.id}
                variant="outline"
                className={`h-12 text-lg ${
                  useCoordinatedClass && selectedClasses.includes(classOption.id.slice(-3)) ? 'bg-purple-300' :
                  !useCoordinatedClass && selectedClasses.includes(classOption.id) ? 'bg-purple-300' :
                  useCoordinatedClass && COORDINATED_CLASS_CONFIG[`coord_class_${selectedClasses[0]}`]?.intl_classes.includes(classOption.id) ? 'bg-purple-100' : ''
                }`}
                onClick={() => handleClassSelection(classOption.id)}
                disabled={useCoordinatedClass && selectedClasses.length > 0 && !selectedClasses.includes(classOption.id.slice(-3))}
              >
                {classOption.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {usClasses.map((classOption) => (
              <Button
                key={classOption.id}
                variant="outline"
                className={`h-12 text-lg ${
                  useCoordinatedClass && selectedClasses.includes(classOption.id) ? 'bg-purple-300' :
                  !useCoordinatedClass && selectedClasses.includes(classOption.id) ? 'bg-purple-300' :
                  useCoordinatedClass && COORDINATED_CLASS_CONFIG[`coord_class_${selectedClasses[0]}`]?.us_classes.includes(classOption.id) ? 'bg-purple-100' : ''
                }`}
                onClick={() => handleClassSelection(classOption.id)}
                disabled={useCoordinatedClass && selectedClasses.length > 0 && !selectedClasses.includes(classOption.id)}
              >
                {classOption.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div id="current-query" className="w-full max-w-4xl space-y-4"> {/* Added id to this div */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">Current Query</h2>
        <div className="bg-gray-100 p-6 rounded-lg min-h-[100px] flex items-center justify-center border border-gray-300 shadow-sm relative">
          {query.length === 0 ? (
            <p className="text-gray-500 text-lg">No conditions added yet.</p>
          ) : (
            <div className="space-y-4 w-full">
              {query.map((part, index) => renderQueryPart(part, index))}
              {(currentFilter.type === 'boolean' || currentValue) && currentFilter.id !== query[query.length - 1].filterId && (
                renderQueryPart({
                  filterId: currentFilter.id,
                  value: currentFilter.type === 'boolean' ? true : currentValue,
                  operator: query.length === 0 ? null : currentOperator
                }, query.length, true)
              )}
            </div>
          )}
          {inputError && (
            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
              Query cannot be empty
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={conductSearch} 
            className="h-12 px-6 text-lg flex items-center gap-2" 
            disabled={query.length === 0 && !currentValue}
          >
            <Search className="h-5 w-5" />
            Conduct Search
          </Button>
        </div>
      </div>

      <SearchResults />
      {isSearching && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}

<style jsx global>{`
  @keyframes flash-red {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(255, 0, 0, 0.2); }
  }
  @keyframes flash-green {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(0, 255, 0, 0.2); }
  }
  .flash-red {
    animation: flash-red 0.5s;
  }
  .flash-green {
    animation: flash-green 0.5s;
  }
`}</style>

