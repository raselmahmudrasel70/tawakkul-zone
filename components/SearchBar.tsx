"use client";
import SearchResults from "./SearchResults";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div suppressHydrationWarning className="relative hidden w-96 md:block">

  <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-md">
    <Search
      size={18}
      className="text-gray-500"
    />

    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="ml-2 w-full bg-transparent text-black outline-none"
    />

    {search && (
      <button
        onClick={() => setSearch("")}
        className="text-gray-400 hover:text-red-500"
      >
        ✕
      </button>
    )}
  </div>

  <SearchResults search={search} />

</div>
  );
}