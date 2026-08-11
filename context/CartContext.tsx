"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;

  // Original price
  price: number;

  // Discounted/current price
  discountedPrice?: number;

  images: string;

  // Product category
  category: string;

  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  hydrated: boolean;

  addToCart: (
    product: Omit<CartItem, "quantity">
  ) => void;

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>(
    []
  );

  const [hydrated, setHydrated] =
    useState(false);

  /* =====================================
     LOAD CART
  ===================================== */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart =
          localStorage.getItem("cart");

        if (savedCart) {
          const parsedCart =
            JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load cart:",
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
     SAVE CART
  ===================================== */

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart, hydrated]);

  /* =====================================
     ADD TO CART
  ===================================== */

  const addToCart = (
    product: Omit<CartItem, "quantity">
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                name: product.name,
                price: product.price,
                discountedPrice:
                  product.discountedPrice,
                images: product.images,
                category: product.category,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  /* =====================================
     INCREASE
  ===================================== */

  const increaseQuantity = (
    id: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  /* =====================================
     DECREASE

     Minimum = 1
  ===================================== */

  const decreaseQuantity = (
    id: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity - 1
              ),
            }
          : item
      )
    );
  };

  /* =====================================
     REMOVE
  ===================================== */

  const removeFromCart = (
    id: number
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  /* =====================================
     CLEAR
  ===================================== */

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =====================================
   USE CART
===================================== */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}