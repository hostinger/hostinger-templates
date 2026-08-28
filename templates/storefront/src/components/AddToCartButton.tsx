"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  productId,
  compact = false,
}: {
  productId: string;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      className={compact ? "add-button compact" : "add-button"}
      type="button"
      onClick={add}
    >
      <span>{added ? "Added" : "Add to cart"}</span>
      <span aria-hidden="true">{added ? "✓" : "＋"}</span>
    </button>
  );
}
