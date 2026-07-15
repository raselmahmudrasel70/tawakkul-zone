"use client";
import { useState } from "react";

const [showSearch, setShowSearch] = useState(false);
export default function SearchOverlay() {
    
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
      <div className="mx-auto mt-4 w-full max-w-lg px-4">
        <div className="rounded-2xl bg-white p-4 shadow-2xl">
          Search Overlay
        </div>
      </div>
    </div>
  );
}