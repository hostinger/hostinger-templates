import Image from "next/image";
import Link from "next/link";
import productsData from "@/content/products.json";
import site from "@/content/site.json";
import { ProductCard } from "@/components/ProductCard";
import { Faq } from "@/components/Faq";
import type { Product } from "@/types/store";

const products = productsData as Product[];
const featured = products.find((product) => product.featured) ?? products[0];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-index" aria-hidden="true">
          <span>CAT.</span>
          <span>001</span>
        </div>
        <div className="hero-copy">
          <p className="label">{site.eyebrow}</p>
          <h1>{site.headline}</h1>
          <p className="hero-intro">{site.intro}</p>
          <Link className="text-link" href="#objects">
            View permanent collection <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="hero-product">
          <Link href={`/products/${featured.slug}`} className="hero-image">
            <Image
              src={featured.image}
              alt={`${featured.name} on a considered work surface`}
              fill
              priority
              sizes="(max-width: 700px) 100vw, 58vw"
              style={{ objectPosition: featured.imagePosition }}
            />
            <div className="hero-caption">
              <span>{featured.id}</span>
              <span>{featured.name}</span>
              <span>View object ↗</span>
            </div>
          </Link>
        </div>
        <p className="hero-vertical">Independent object studio / Kyoto</p>
      </section>

      <section className="catalogue" id="objects" aria-labelledby="catalogue-heading">
        <div className="catalogue-header">
          <div>
            <p className="label">02 / Permanent collection</p>
            <h2 id="catalogue-heading">Eight objects.<br />Nothing extra.</h2>
          </div>
          <p>
            Each piece solves one small recurring problem. Made in short runs,
            with repairable materials and no seasonal churn.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="studio-section" id="studio" aria-labelledby="studio-heading">
        <div className="studio-copy">
          <p className="label">03 / Studio practice</p>
          <h2 id="studio-heading">Useful first.<br /><em>Beautiful</em> by consequence.</h2>
          <p>
            We begin with friction: the cable that wanders, the note without a
            home, the light that tires the eyes. Then we remove material until
            only the useful gesture remains.
          </p>
        </div>
        <div className="studio-figure">
          <Image
            src="/images/studio-desk.jpg"
            alt="Kado studio desk with sketches, stationery and material samples"
            fill
            loading="eager"
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <p>Workbench 02 / Kyoto, Japan</p>
        </div>
        <div className="material-notes">
          <div><span>01</span><p>Honest materials</p><small>Steel / ash / brass / pulp</small></div>
          <div><span>02</span><p>Short production</p><small>Made in runs of 20–60</small></div>
          <div><span>03</span><p>Designed to remain</p><small>No seasonal collections</small></div>
        </div>
      </section>

      <Faq />
    </>
  );
}
