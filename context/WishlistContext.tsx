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
  const [loaded, setLoaded] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("wishlist");

      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !loaded) return;

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, loaded]);

  // Add Wishlist
  const addToWishlist = (product: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) return prev;

      return [...prev, product];
    });
  };

  // Remove Wishlist
  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear Wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
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