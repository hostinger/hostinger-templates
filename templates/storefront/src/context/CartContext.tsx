"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import products from "@/content/products.json";
import type { CartLine, Product } from "@/types/store";

const STORAGE_KEY = "kado-cart-v1";

type DetailedLine = CartLine & { product: Product };

type CartContextValue = {
  lines: DetailedLine[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  announcement: string;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const catalogue = products as Product[];

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.productId === "string" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0 &&
    catalogue.some((product) => product.id === line.productId)
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let active = true;
    let storedCart: CartLine[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) storedCart = stored.filter(isCartLine);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    queueMicrotask(() => {
      if (!active) return;
      setCart(storedCart);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addItem = useCallback((productId: string) => {
    const product = catalogue.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing
        ? current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { productId, quantity: 1 }];
    });
    setAnnouncement(`${product.name} added to cart.`);
  }, []);

  const removeItem = useCallback((productId: string) => {
    const product = catalogue.find((item) => item.id === productId);
    setCart((current) =>
      current.filter((line) => line.productId !== productId),
    );
    if (product) setAnnouncement(`${product.name} removed from cart.`);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const nextQuantity = Math.max(1, Math.min(20, Math.round(quantity)));
    setCart((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: nextQuantity }
          : line,
      ),
    );
    const product = catalogue.find((item) => item.id === productId);
    if (product) {
      setAnnouncement(`${product.name} quantity changed to ${nextQuantity}.`);
    }
  }, []);

  const lines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = catalogue.find(
          (item) => item.id === line.productId,
        );
        return product ? [{ ...line, product }] : [];
      }),
    [cart],
  );

  const value = useMemo(
    () => ({
      lines,
      hydrated,
      announcement,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
      ),
      addItem,
      removeItem,
      setQuantity,
    }),
    [lines, hydrated, announcement, addItem, removeItem, setQuantity],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
