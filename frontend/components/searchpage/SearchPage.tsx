// SearchPage.tsx

"use client";

import { useState } from "react";
import SearchResults from "./SearchResults";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { SearchResult } from "@/utils/types/case";
import { Toaster } from "@/components/ui/toaster";
import FilterGroup from "./FilterGroup";
import QueryBuilder from "./QueryBuilder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Backend expects this format
interface BackendGroup {
  operator: "AND" | "OR";
  operands: (SearchFilter | BackendGroup)[];
}

export default function SearchPage() {
  const [filterTree, setFilterTree] = useState<Group | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_results: 0,
    per_page: 60,
  });

  // Transform our UI filter tree into the backend format
  const transformForBackend = (group: Group): BackendGroup => {
    // For a group with a single operand, just use AND (it doesn't matter)
    if (group.operands.length <= 1) {
      return {
        operator: "AND",
        operands: group.operands.map(op => 
          "adjacentOperators" in op ? transformForBackend(op) : op
        )
      };
    }

    // For multiple operands, we need to preserve operator precedence
    // We'll process pairs from left to right, creating nested groups as needed
    let result: SearchFilter | BackendGroup = 
      "adjacentOperators" in group.operands[0] 
        ? transformForBackend(group.operands[0] as Group)
        : group.operands[0];
    
    for (let i = 1; i < group.operands.length; i++) {
      const operator = group.adjacentOperators[i - 1];
      const nextOperand = group.operands[i];
      
      result = {
        operator,
        operands: [
          result,
          "adjacentOperators" in nextOperand 
            ? transformForBackend(nextOperand as Group) 
            : nextOperand
        ]
      };
    }

    return result as BackendGroup;
  };

  const handleAddFilter = (filter: SearchFilter) => {
    if (filterTree) {
      // Add the new filter and a default "AND" operator if there are existing operands
      const newOperands = [...filterTree.operands, filter];
      const newAdjOps = [...filterTree.adjacentOperators];
      if (filterTree.operands.length > 0) {
        newAdjOps.push("AND");  // Default to AND when adding new filters
      }
      
      setFilterTree({
        operands: newOperands,
        adjacentOperators: newAdjOps,
      });
    } else {
      // First filter - no adjacentOperators needed yet
      setFilterTree({
        operands: [filter],
        adjacentOperators: [],
      });
    }
  };

  const handleAddGroup = () => {
    const newGroup: Group = {
      operands: [],
      adjacentOperators: [],
    };

    if (filterTree) {
      // Add the new group and a default "AND" operator if there are existing operands
      const newOperands = [...filterTree.operands, newGroup];
      const newAdjOps = [...filterTree.adjacentOperators];
      if (filterTree.operands.length > 0) {
        newAdjOps.push("AND");
      }
      
      setFilterTree({
        operands: newOperands,
        adjacentOperators: newAdjOps,
      });
    } else {
      setFilterTree(newGroup);
    }
  };

  const handleUpdateFilterTree = (updatedTree: Group) => {
    setFilterTree(updatedTree);
  };

  const handleDeleteRootGroup = () => {
    setFilterTree(null);
  };

  const handleSearch = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.combinedSearch, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter_tree: filterTree ? transformForBackend(filterTree) : null,
          page,
          per_page: pagination.per_page,
        }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results);
      setPagination(data.pagination);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: 'current_page' | 'full') => {
    if (!filterTree) return;

    try {
      const response = await fetch(API_ENDPOINTS.exportSearch, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter_tree: filterTree ? transformForBackend(filterTree) : null,
          export_type: type,
          page: pagination.current_page,
          per_page: pagination.per_page,
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to download
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1] || 'export.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center space-y-10">
      <Toaster />
      <div className="w-full max-w-6xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Federal Trademark Database Search
        </h2>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        <QueryBuilder onAddFilter={handleAddFilter} />
      </div>

      <div id="current-query" className="w-full max-w-6xl space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Current Query
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg min-h-[100px] border border-gray-300 shadow-sm">
          {filterTree === null ? (
            <div className="text-center text-gray-500">
              No filters added yet. Use the query builder above to add filters.
            </div>
          ) : (
            <FilterGroup
              group={filterTree}
              onUpdate={handleUpdateFilterTree}
              onDelete={handleDeleteRootGroup}
              level={0}
            />
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handleSearch(1)}
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={!filterTree || filterTree.operands.length === 0}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 px-6 text-lg flex items-center gap-2"
                disabled={!results.length}
              >
                <Download className="h-5 w-5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('current_page')}>
                Export Current Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('full')}>
                Export First 500 Results
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SearchResults
        results={results}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handleSearch}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}