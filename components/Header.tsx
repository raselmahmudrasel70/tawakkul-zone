"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Header() {
  const menuRef = useRef<HTMLDivElement>(null);

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [user, setUser] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showMenu]);

  return (
    <header className="sticky top-0 z-50 bg-green-950 text-white shadow-lg">

      {/* Desktop */}
            <div className="hidden lg:block">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
          {/* Logo */}
          <div className="shrink-0">
            <h1 className="text-3xl font-bold leading-none">
              <span className="text-cyan-300">Tawakkul</span>{" "}
              <span className="text-amber-300">Zone</span>
            </h1>

            <p className="mt-1 text-xs text-green-200">
              বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
            </p>
          </div>

          {/* Search */}
          <div className="mx-8 flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex shrink-0 items-center gap-6">
            <Link href="/wishlist" className="relative">
              <Heart className="hover:text-pink-400 transition" />

              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="hover:text-yellow-400 transition" />

              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
  <>
    <Link href="/dashboard">
      <User className="cursor-pointer hover:text-cyan-300 transition" />
    </Link>

    <button
      onClick={async () => {
        await supabase.auth.signOut();
      }}
      className="rounded-lg border border-red-500 px-4 py-2 hover:bg-red-600"
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link href="/login">
      <button className="rounded-lg border border-white px-4 py-2 hover:bg-white hover:text-green-900">
        Login
      </button>
    </Link>

    <Link href="/signup">
      <button className="rounded-lg bg-green-700 px-4 py-2 hover:bg-green-800">
        Signup
      </button>
    </Link>
  </>
)}
          </div>
        </div>
      </div>

      {/* Mobile */}
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

                <button onClick={() => setShowSearch(false)}>
                  <X size={20} className="text-gray-500" />
                </button>

              </div>

              <SearchResults search={search} />

            </div>
          )}

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-xl font-bold">
                <span className="text-cyan-300">Tawakkul</span>{" "}
                <span className="text-amber-300">Zone</span>
              </h1>

              <p className="hidden md:block text-xs text-green-200">
                বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setShowSearch(true)}
                className="hover:text-cyan-300 transition"
              >
                <Search size={22} />
              </button>

              <Link href="/wishlist" className="relative">
                <Heart size={22} />

                {wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative">
                <ShoppingCart size={22} />

                {cart.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="hover:text-cyan-300 transition"
              >
                {showMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-2 top-16 z-50 w-56 rounded-xl border border-green-700 bg-green-900 p-3 shadow-xl"
            >
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded px-3 py-2 hover:bg-green-800"
                    onClick={() => setShowMenu(false)}
                  >
                    👤 Dashboard
                  </Link>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setShowMenu(false);
                    }}
                    className="mt-2 w-full rounded bg-red-600 px-3 py-2 text-left hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded px-3 py-2 hover:bg-green-800"
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="mt-2 block rounded bg-green-700 px-3 py-2 text-center hover:bg-green-800"
                    onClick={() => setShowMenu(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}

        </div>
      </div>

    </header>
  );
}