import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review selected Kado Objects and continue to checkout or enquiry.",
};

export default function CartPage() {
  return (
    <div className="cart-page">
      <CartView />
    </div>
  );
}
