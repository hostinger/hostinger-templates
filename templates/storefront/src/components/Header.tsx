"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount, hydrated } = useCart();

  return (
    <>
      <div className="announcement">
        <p>Free tracked shipping over $200</p>
        <p className="announcement-code">KYOTO / 35.0116° N</p>
      </div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Kado Objects home">
          KADO<span>物</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#objects">Objects</Link>
          <Link href="/#studio">Studio</Link>
          <Link className="cart-link" href="/cart">
            Cart <span aria-label={`${hydrated ? itemCount : 0} items`}>{hydrated ? itemCount : 0}</span>
          </Link>
        </nav>
      </header>
    </>
  );
}
