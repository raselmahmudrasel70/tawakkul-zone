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

  const { cart, hydrated: cartHydrated } = useCart();
  const { wishlist, hydrated: wishlistHydrated } = useWishlist();

  const [user, setUser] = useState<{
    id: string;
    email?: string;
  } | null>(null);

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
    <header className="sticky top-0 z-50 bg-slate-400 text-white shadow-lg">

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <Link href="/" className="shrink-0">
  <h1 className="text-3xl font-bold leading-none">
    <span className="text-cyan-300">Tawakkul</span>{" "}
    <span className="text-amber-300">Zone</span>
  </h1>

  <p className="mt-1 text-xs text-white">
    বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
  </p>
</Link>

          {/* Search */}
          <div className="mx-8 flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex shrink-0 items-center gap-6">

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="group flex items-center gap-3 whitespace-nowrap text-slate-800 transition"
            >
              <div className="relative">
                <Heart
                  size={31}
                  strokeWidth={1.7}
                  className="transition group-hover:text-slate-600"
                />

                {wishlistHydrated &&
                  wishlist.length > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-pink-100 px-1.5 text-xs font-medium text-slate-700">
                      {wishlist.length}
                    </span>
                  )}
              </div>

              <span className="text-lg font-normal">
                My Wish List
              </span>
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="group flex items-center gap-3 whitespace-nowrap text-slate-800 transition"
            >
              <div className="relative">
                <ShoppingCart
                  size={30}
                  strokeWidth={1.8}
                  className="transition group-hover:text-slate-600"
                />

                {cartHydrated &&
                  cart.length > 0 && (
                    <span className="absolute -right-3 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-pink-100 px-1.5 text-xs font-medium text-slate-700">
                      {cart.length}
                    </span>
                  )}
              </div>

              <span className="text-lg font-normal">
                Shopping Cart
              </span>
            </Link>

            {/* Authentication */}
            {user ? (
              <>
                <Link href="/dashboard">
                  <User
                    className="cursor-pointer text-slate-800 transition hover:text-slate-600"
                    size={27}
                  />
                </Link>

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                  }}
                  className="rounded-lg border border-red-500 px-4 py-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-lg font-medium text-slate-800 transition hover:text-cyan-700"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-white transition hover:bg-green-800"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden">
        <div className="relative mx-auto max-w-7xl px-2 py-3">

          {/* Mobile Search */}
          {showSearch && (
            <div className="border-t border-white/10 bg-slate-400 p-3">

              <div className="flex items-center rounded-full bg-white px-4">

                <Search
                  size={18}
                  className="text-gray-500"
                />

                <input
                  id="mobile-search"
                  name="search"
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="flex-1 bg-transparent px-3 py-3 text-black outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowSearch(false)
                  }
                >
                  <X
                    size={20}
                    className="text-gray-500"
                  />
                </button>
              </div>

              <SearchResults search={search} />
            </div>
          )}

          {/* Mobile Header Row */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="shrink-0">
  <h1 className="text-3xl font-bold leading-none">
    <span className="text-cyan-300">Tawakkul</span>{" "}
    <span className="text-amber-300">Zone</span>
  </h1>

  <p className="mt-1 text-xs text-white">
    বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
  </p>
</Link>

            {/* Mobile Icons */}
            <div className="flex items-center gap-3">

              {/* Search */}
              <button
                onClick={() =>
                  setShowSearch(true)
                }
                className="text-white transition hover:text-cyan-300"
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative"
              >
                <Heart size={22} />

                {wishlistHydrated &&
                  wishlist.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {wishlist.length}
                    </span>
                  )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative"
              >
                <ShoppingCart size={22} />

                {cartHydrated &&
                  cart.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {cart.length}
                    </span>
                  )}
              </Link>

              {/* Menu */}
              <button
                onClick={() =>
                  setShowMenu((prev) => !prev)
                }
                className="transition hover:text-cyan-300"
              >
                {showMenu ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-2 top-16 z-50 w-56 rounded-xl border border-slate-500 bg-slate-400 p-3 text-slate-900 shadow-xl"
            >

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded px-3 py-2 transition hover:bg-slate-500"
                    onClick={() =>
                      setShowMenu(false)
                    }
                  >
                    👤 Dashboard
                  </Link>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setShowMenu(false);
                    }}
                    className="mt-2 w-full rounded bg-red-600 px-3 py-2 text-left text-white transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded px-3 py-2 transition hover:bg-slate-500"
                    onClick={() =>
                      setShowMenu(false)
                    }
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="mt-2 block rounded bg-green-700 px-3 py-2 text-center text-white transition hover:bg-green-800"
                    onClick={() =>
                      setShowMenu(false)
                    }
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