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
      strategy: "wordmark",
      query: "",
      label: "Wordmark"
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