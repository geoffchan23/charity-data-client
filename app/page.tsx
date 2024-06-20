"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SemanticSearch from "./components/SemanticSearch"
import SearchResults from "./components/SearchResults"
import FilterSearch from "./components/FilterSearch"

export default function Home() {
  const [searchType, setSearchType] = useState("semantic");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="flex flex-col items-center min-h-screen p-12">
      <h1 className="text-2xl font-bold mb-4">Charity Search (2023)</h1>
      <Tabs defaultValue="semantic" className="w-[100%]" value={searchType} onValueChange={(val) => setSearchType(val)}>
        <TabsList className="w-[100%]">
          <TabsTrigger value="semantic" className="tab-button">Semantic Search (Beta)</TabsTrigger>
          <TabsTrigger value="results" className="tab-button">Semantic Search Results (Beta)</TabsTrigger>
          <TabsTrigger value="filter" className="tab-button">Filter Search (Local only)</TabsTrigger>
        </TabsList>
        <TabsContent value="filter">
          <FilterSearch />
        </TabsContent>
        <TabsContent value="semantic">
          <SemanticSearch setSearchResults={setSearchResults} setSearchType={setSearchType} />
        </TabsContent>
        <TabsContent value="results">
          <SearchResults value={searchResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
