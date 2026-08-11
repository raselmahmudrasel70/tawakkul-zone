"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type WishlistItem = {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string;
  category: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  hydrated: boolean;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined
  );

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  /* =====================================
     LOAD WISHLIST FROM LOCAL STORAGE
  ===================================== */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved =
          localStorage.getItem("wishlist");

        if (saved) {
          const parsedWishlist =
            JSON.parse(saved);

          if (Array.isArray(parsedWishlist)) {
            setWishlist(
              parsedWishlist
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =====================================
     SAVE WISHLIST TO LOCAL STORAGE
  ===================================== */

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist, hydrated]);

  /* =====================================
     ADD TO WISHLIST
  ===================================== */

  const addToWishlist = (
    product: WishlistItem
  ) => {
    setWishlist((prev) => {
      if (
        prev.some(
          (item) =>
            item.id === product.id
        )
      ) {
        return prev;
      }

      return [
        ...prev,
        product,
      ];
    });
  };

  /* =====================================
     REMOVE FROM WISHLIST
  ===================================== */

  const removeFromWishlist = (
    id: number
  ) => {
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /* =====================================
     CLEAR WISHLIST
  ===================================== */

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        hydrated,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/* =====================================
   USE WISHLIST
===================================== */

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}