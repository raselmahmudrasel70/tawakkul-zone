"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-96">
      <Search size={18} className="text-gray-500" />

      <input
        type="text"
        placeholder="Search Products..."
        className="ml-2 w-full outline-none text-black"
      />
    </div>
  );
}