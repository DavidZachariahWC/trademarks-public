// QueryBuilder.tsx

import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import SearchOptions from "./SearchOptions";
import { Input } from "@/components/ui/input";
import CoordinatedClassSelector from "./CoordinatedClassSelector";
import { DATE_STRATEGIES, BOOLEAN_STRATEGIES } from "@/utils/constants/search";

interface SearchFilter {
  strategy: string;
  query: string;
  group?: string;
  label?: string;
}

interface Group {
  operands: (SearchFilter | Group)[];
  adjacentOperators: ("AND" | "OR")[];
}

interface QueryBuilderProps {
  onAddFilter: (filter: SearchFilter) => void;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({ onAddFilter }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<SearchFilter>({
    strategy: "wordmark",
    query: "",
    label: "Wordmark"
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const resetCurrentFilter = () => {
    setCurrentFilter({
      ...currentFilter,
      query: ""
    });
  };

  // Focus input when filter is selected
  useEffect(() => {
    if (currentFilter.strategy && !BOOLEAN_STRATEGIES.has(currentFilter.strategy)) {
      inputRef.current?.focus();
    }
  }, [currentFilter.strategy]);

  const handleStrategySelect = (strategy: string, group: string, label: string) => {
    if (BOOLEAN_STRATEGIES.has(strategy)) {
      onAddFilter({ strategy, query: "true", group, label });
      setIsSidebarOpen(false);
      resetCurrentFilter();
    } else {
      setCurrentFilter({
        strategy,
        query: "",
        group,
        label
      });
      setIsSidebarOpen(false);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    resetCurrentFilter();
  };

  const handleAddFilter = () => {
    onAddFilter(currentFilter);
    resetCurrentFilter();
    setIsSidebarOpen(false);
  };

  const handleClassSelect = (classes: string[]) => {
    if (classes.length > 0) {
      setCurrentFilter({
        ...currentFilter,
        query: `coord_class_${classes[0]}`,
      });
    } else {
      setCurrentFilter({ ...currentFilter, query: "" });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
      <div className="flex flex-wrap items-start gap-4">
        {/* Filter Selection */}
        <div className="w-[200px]">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12 text-base bg-gray-100 hover:bg-gray-200">
                <span className="truncate">{currentFilter.label || "Select Filter"}</span>
                <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className="mb-4">Select Filter</SheetTitle>
              <div className="h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                <SearchOptions
                  onSelect={handleStrategySelect}
                  onClose={handleCloseSidebar}
                  booleanStrategies={BOOLEAN_STRATEGIES}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Input Field */}
        {currentFilter.strategy && !BOOLEAN_STRATEGIES.has(currentFilter.strategy) && (
          <div className="flex-1">
            {currentFilter.strategy === "coordinated_class" ? (
              <CoordinatedClassSelector onSelect={handleClassSelect} />
            ) : DATE_STRATEGIES.has(currentFilter.strategy) ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  type="date"
                  placeholder="Start date..."
                  value={currentFilter.query.split(' - ')[0] || ''}
                  onChange={(e) => {
                    const endDate = currentFilter.query.split(' - ')[1] || '';
                    setCurrentFilter({ 
                      ...currentFilter, 
                      query: `${e.target.value}${endDate ? ' - ' + endDate : ''}`
                    });
                  }}
                  className="h-12 text-base bg-gray-100"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  placeholder="End date..."
                  value={currentFilter.query.split(' - ')[1] || ''}
                  onChange={(e) => {
                    const startDate = currentFilter.query.split(' - ')[0] || '';
                    setCurrentFilter({ 
                      ...currentFilter, 
                      query: `${startDate ? startDate + ' - ' : ''}${e.target.value}`
                    });
                  }}
                  className="h-12 text-base bg-gray-100"
                />
              </div>
            ) : currentFilter.strategy === "design_code" ? (
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter 6-digit design code (e.g. 020101)"
                    value={currentFilter.query}
                    maxLength={8}
                    onChange={(e) => {
                      // Remove any non-digit and non-X characters
                      let value = e.target.value.replace(/[^0-9X]/g, '');
                      
                      // Format with dots (but not if it ends with XX)
                      if (!value.endsWith('XX')) {
                        if (value.length > 2) value = value.slice(0, 2) + '.' + value.slice(2);
                        if (value.length > 5) value = value.slice(0, 5) + '.' + value.slice(5);
                      }
                      
                      // Store without dots
                      setCurrentFilter({ 
                        ...currentFilter, 
                        query: value.replace(/\./g, '')
                      });
                    }}
                    className="h-12 text-base bg-gray-100"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Format: XXXXXX (e.g. 020101)</p>
                  <p>For wildcard search, use ####XX where #### is your prefix (e.g., 0201XX)</p>
                </div>
              </div>
            ) : currentFilter.strategy === "drawing_code_type" ? (
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter single digit (0-6)"
                    value={currentFilter.query}
                    maxLength={1}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-6]/g, '');
                      setCurrentFilter({ 
                        ...currentFilter, 
                        query: value
                      });
                    }}
                    className="h-12 text-base bg-gray-100"
                  />
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="grid grid-cols-7 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <div 
                        key={num}
                        className="relative"
                      >
                        <button
                          onClick={() => {
                            setCurrentFilter({ ...currentFilter, query: num.toString() });
                            inputRef.current?.focus();
                          }}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                        >
                          {num}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
                            {num === 0 && "Mark drawing code not yet assigned."}
                            {num === 1 && "Typeset: Word(s)/letter(s)/number(s). (The mark consists only of words, letters, or numbers in a standard, non-stylized font)."}
                            {num === 2 && "Illustration: Drawing or design without any word(s)/letter(s)/number(s). (The mark is purely a design or image with no text)."}
                            {num === 3 && "Illustration: Drawing or design which also includes word(s)/letter(s)/number(s). (The mark is a combination of a design/image and text)."}
                            {num === 4 && "Illustration: Drawing with word(s)/letter(s)/number(s) in Block form. (The mark includes a design and text, where the text is in a standard, block-like font)."}
                            {num === 5 && "Illustration: Drawing with word(s)/letter(s)/number(s) in Stylized form. (The mark includes a design and text, where the text is in a stylized font or presentation)."}
                            {num === 6 && "Where no drawing is possible, such as for sound. (The mark is not visually perceptible, such as a sound mark or a scent mark)."}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-amber-600 mt-2">
                    Note: Type 4 marks represent "Block letter drawing" if filed before Nov 2, 2003, or "Standard Character Mark" if filed after.
                  </div>
                </div>
              </div>
            ) : (
              <Input
                ref={inputRef}
                type="text"
                placeholder="Enter value..."
                value={currentFilter.query}
                onChange={(e) =>
                  setCurrentFilter({ ...currentFilter, query: e.target.value })
                }
                className="h-12 text-base bg-gray-100"
              />
            )}
          </div>
        )}

        {/* Add Filter Button */}
        <Button
          size="lg"
          onClick={handleAddFilter}
          disabled={
            !currentFilter.strategy || 
            (!currentFilter.query && !BOOLEAN_STRATEGIES.has(currentFilter.strategy)) ||
            (DATE_STRATEGIES.has(currentFilter.strategy) && (
              !currentFilter.query.includes(' - ') || 
              new Date(currentFilter.query.split(' - ')[0]) > new Date(currentFilter.query.split(' - ')[1])
            ))
          }
          className="h-12 px-6 text-base flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Filter
        </Button>
      </div>
    </div>
  );
};

export default QueryBuilder; 