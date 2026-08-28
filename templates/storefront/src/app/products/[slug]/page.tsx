import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import productsData from "@/content/products.json";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/hooks/useCurrency";
import type { Product } from "@/types/store";

const products = productsData as Product[];

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product
    ? { title: product.name, description: product.shortDescription }
    : {};
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id)
    .slice(0, 2);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <article className="product-detail">
        <div className="product-detail-image">
          <Image
            src={product.image}
            alt={`${product.name} product view`}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
            style={{ objectPosition: product.imagePosition }}
          />
          <p>{product.id} / {product.category}</p>
        </div>
        <div className="product-detail-copy">
          <Link className="back-link" href="/#objects">← Catalogue index</Link>
          <p className="label">{product.edition}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatCurrency(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <AddToCartButton productId={product.id} />
          <dl className="spec-list">
            <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>
            <div><dt>Material</dt><dd>{product.material}</dd></div>
            <div><dt>Finish</dt><dd>{product.finish}</dd></div>
            <div><dt>Dispatch</dt><dd>{product.leadTime}</dd></div>
          </dl>
          <p className="detail-note">
            Natural materials vary. Each piece is inspected and packed by hand
            in our Kyoto studio.
          </p>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </article>
      <section className="related-section" aria-labelledby="related-heading">
        <div className="section-marker">
          <p className="label">Continue the set</p>
          <h2 id="related-heading">Works well beside</h2>
        </div>
        <div className="related-grid">
          {related.map((item, index) => (
            <ProductCard product={item} index={index} key={item.id} />
          ))}
        </div>
      </section>
    </>
  );
}
