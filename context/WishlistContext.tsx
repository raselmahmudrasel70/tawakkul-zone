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
  images: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  hydrated: boolean;
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load wishlist from localStorage after mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("wishlist");

        if (saved) {
          const parsedWishlist: WishlistItem[] = JSON.parse(saved);
          setWishlist(parsedWishlist);
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

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

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}