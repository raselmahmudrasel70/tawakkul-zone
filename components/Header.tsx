"use client";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-green-950/90 backdrop-blur-md text-white shadow-lg">
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

          <Heart className="cursor-pointer hover:text-pink-400" />

          {/* Cart */}
          <Link href="/cart" className="relative cursor-pointer">
            <ShoppingCart className="hover:text-yellow-400" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cart.length}
            </span>
          </Link>

          <User className="cursor-pointer hover:text-cyan-300" />

        </div>

      </div>
    </header>
  );
}