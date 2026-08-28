import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/store";
import { formatCurrency } from "@/hooks/useCurrency";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <article className={`product-card product-card-${(index % 4) + 1}`}>
      <Link className="product-image-link" href={`/products/${product.slug}`}>
        <div className="product-image">
          <Image
            src={product.image}
            alt={`${product.name} in a styled desk setting`}
            fill
            loading="eager"
            sizes="(max-width: 700px) 100vw, 50vw"
            style={{ objectPosition: product.imagePosition }}
          />
          <span className="image-index">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </Link>
      <div className="product-card-copy">
        <p className="label">{product.edition}</p>
        <div className="product-title-row">
          <h3>
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p>{formatCurrency(product.price)}</p>
        </div>
        <p className="product-summary">{product.shortDescription}</p>
        <AddToCartButton productId={product.id} compact />
      </div>
    </article>
  );
}
