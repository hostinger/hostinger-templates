"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import site from "@/content/site.json";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/hooks/useCurrency";

export function CartView() {
  const { lines, subtotal, hydrated, removeItem, setQuantity } = useCart();
  const statusRef = useRef<HTMLParagraphElement>(null);

  function remove(productId: string) {
    removeItem(productId);
    requestAnimationFrame(() => {
      const emptyHeading = document.querySelector<HTMLElement>("#empty-heading");
      (emptyHeading ?? statusRef.current)?.focus();
    });
  }

  if (!hydrated) {
    return <p className="cart-loading">Opening your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <section className="empty-cart" aria-labelledby="empty-heading">
        <p className="label">Cart / 00 objects</p>
        <h1 id="empty-heading" tabIndex={-1}>Your work surface is still clear.</h1>
        <p>
          Start with one useful object. The permanent collection is made for
          daily work, not display.
        </p>
        <Link className="text-link" href="/#objects">
          Browse all objects <span aria-hidden="true">↘</span>
        </Link>
      </section>
    );
  }

  const enquirySubject = encodeURIComponent("Kado Objects order enquiry");
  const enquiryBody = encodeURIComponent(
    `Hello Kado Objects,\n\nI would like to enquire about:\n${lines
      .map((line) => `• ${line.quantity} × ${line.product.name}`)
      .join("\n")}\n\nEstimated subtotal: ${formatCurrency(subtotal)}`,
  );

  return (
    <div className="cart-layout">
      <section aria-labelledby="cart-heading">
        <p
          className="label"
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
        >
          Cart / {String(lines.length).padStart(2, "0")} object types
        </p>
        <h1 id="cart-heading">Selected objects</h1>
        <div className="cart-lines">
          {lines.map((line) => (
            <article className="cart-line" key={line.productId}>
              <Link
                className="cart-line-image"
                href={`/products/${line.product.slug}`}
              >
                <Image
                  src={line.product.image}
                  alt=""
                  fill
                  sizes="140px"
                  style={{ objectPosition: line.product.imagePosition }}
                />
              </Link>
              <div className="cart-line-copy">
                <p className="label">{line.product.edition}</p>
                <h2>
                  <Link href={`/products/${line.product.slug}`}>
                    {line.product.name}
                  </Link>
                </h2>
                <p>{formatCurrency(line.product.price)}</p>
              </div>
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() =>
                    line.quantity === 1
                      ? remove(line.productId)
                      : setQuantity(line.productId, line.quantity - 1)
                  }
                  aria-label={`Decrease ${line.product.name} quantity`}
                >
                  −
                </button>
                <span aria-live="polite" aria-label={`${line.quantity} items`}>
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(line.productId, line.quantity + 1)
                  }
                  aria-label={`Increase ${line.product.name} quantity`}
                >
                  +
                </button>
              </div>
              <p className="line-total">
                {formatCurrency(line.product.price * line.quantity)}
              </p>
              <button
                className="remove-button"
                type="button"
                onClick={() => remove(line.productId)}
              >
                Remove <span className="sr-only">{line.product.name}</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="cart-summary" aria-labelledby="summary-heading">
        <p className="label">Order summary</p>
        <h2 id="summary-heading">Ready when you are.</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd>{subtotal >= 200 ? "Included" : "Calculated on enquiry"}</dd></div>
          <div className="summary-total"><dt>Estimated total</dt><dd>{formatCurrency(subtotal)}</dd></div>
        </dl>
        {site.checkoutUrl ? (
          <a className="checkout-button" href={site.checkoutUrl}>
            Continue to secure checkout <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <>
            <a
              className="checkout-button"
              href={`mailto:${site.enquiryEmail}?subject=${enquirySubject}&body=${enquiryBody}`}
            >
              Send order enquiry <span aria-hidden="true">↗</span>
            </a>
            <p className="checkout-note">
              Online checkout is not configured. This opens a pre-filled email;
              no payment is taken here.
            </p>
          </>
        )}
        <ul>
          <li>Tracked international delivery</li>
          <li>14-day return window</li>
          <li>Plastic-free packing</li>
        </ul>
      </aside>
    </div>
  );
}
