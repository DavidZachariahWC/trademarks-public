// SearchPage.tsx

"use client";

import { useState } from "react";
import SearchResults from "./SearchResults";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";
import type { SearchResult } from "@/utils/types/case";
import { Toaster } from "@/components/ui/toaster";
import FilterGroup from "./FilterGroup";
import QueryBuilder from "./QueryBuilder";

interface SearchFilter {
  strategy: string;
  query: string;
  group?: string;
}

interface Group {
  operator: "AND" | "OR";
  operands: (SearchFilter | Group)[];
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
    per_page: 10,
  });

  const handleAddFilter = (filter: SearchFilter) => {
    if (filterTree) {
      setFilterTree({
        ...filterTree,
        operands: [...filterTree.operands, filter],
      });
    } else {
      setFilterTree({
        operator: "AND",
        operands: [filter],
      });
    }
  };

  const handleAddGroup = () => {
    const newGroup: Group = {
      operator: "AND",
      operands: [],
    };

    if (filterTree) {
      setFilterTree({
        ...filterTree,
        operands: [...filterTree.operands, newGroup],
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
          filter_tree: filterTree,
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

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 flex flex-col items-center space-y-10">
      <Toaster />
      <div className="w-full max-w-6xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Federal Trademark Database Search
        </h2>
      </div>

      <div className="w-full max-w-6xl space-y-4">

        <QueryBuilder onAddFilter={handleAddFilter} onAddGroup={handleAddGroup} />
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
        <div className="flex justify-center">
          <Button
            onClick={() => handleSearch(1)}
            className="h-12 px-6 text-lg flex items-center gap-2"
            disabled={!filterTree || filterTree.operands.length === 0}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
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