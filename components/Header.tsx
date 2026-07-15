"use client";
import SearchOverlay from "./SearchOverlay";
import SearchResults from "./SearchResults";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";
export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <header className="sticky top-0 z-50 bg-green-950/90 backdrop-blur-md text-white shadow-lg">

      {/* ================= Desktop ================= */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-cyan-300">Tawakkul</span>{" "}
              <span className="text-amber-300">Zone</span>
            </h1>

            <p className="text-xs text-green-200">
              বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
            </p>
          </div>

          {/* Search */}
          <SearchBar />

          {/* Icons */}
          <div className="flex items-center gap-5">

            <Link href="/wishlist" className="relative">
              <Heart className="hover:text-pink-400" />

              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="hover:text-yellow-400" />

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cart.length}
              </span>
            </Link>

            <Link href="/dashboard">
              <User className="cursor-pointer hover:text-cyan-300" />
            </Link>

          </div>

        </div>
      </div>

      {/* ================= Mobile ================= */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-7xl px-2 py-3">
{showSearch && (
  <div className="border-t border-white/10 bg-green-950 p-3">

    <div className="flex items-center rounded-full bg-white px-4">

      <Search size={18} className="text-gray-500" />

      <input
  autoFocus
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="flex-1 bg-transparent px-3 py-3 text-black outline-none"
/>

      <button
        onClick={() => setShowSearch(false)}
      >
        <X size={20} className="text-gray-500" />
      </button>

    </div>
    <SearchResults search={search} />
  </div>
)}
          {/* Top Row */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-cyan-300">Tawakkul</span>{" "}
                <span className="text-amber-300">Zone</span>
              </h1>

              <p className="hidden md:block text-xs text-green-200">
  বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
</p>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">

  <button
    onClick={() => setShowSearch(true)}
    className="transition hover:text-cyan-300"
  >
    <Search size={22} />
  </button>

  <Link href="/wishlist" className="relative">
    <Heart size={22} />

    {wishlist.length > 0 && (
      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
        {wishlist.length}
      </span>
    )}
  </Link>

  <Link href="/cart" className="relative">
    <ShoppingCart size={22} />

    {cart.length > 0 && (
      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
        {cart.length}
      </span>
    )}
  </Link>

  <Link href="/dashboard">
    <User size={22} />
  </Link>

</div>
</div>


        </div>
      </div>

    </header>
  );
}