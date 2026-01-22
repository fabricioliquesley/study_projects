"use client";

import { createContext, useContext, useState } from "react";

type CartItem = {
  productId: string;
  quantity: number;
};

interface ICartContext {
  items: CartItem[];
  addToCart: (productId: string) => void;
}

interface CartProviderProps {
  children: React.ReactNode;
}

const cartContext = createContext({} as ICartContext);

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (productId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);

      if (existingItem) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { productId, quantity: 1 }];
    });
  };

  return (
    <cartContext.Provider value={{ items: cartItems, addToCart }}>
      {children}
    </cartContext.Provider>
  );
}

export const useCart = () => useContext(cartContext);
