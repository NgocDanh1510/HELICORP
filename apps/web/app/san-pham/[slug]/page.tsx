import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "../../../components/cart/ProductPurchasePanel";
import { getProductBySlug, getProducts } from "../../../lib/services/productService";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/1200x900/111827/ffffff.png?text=HeliPhone";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "San pham khong ton tai | HeliPhone Aurora"
    };
  }

  const url = `${siteUrl}/san-pham/${product.slug}.html`;

  return {
    title: `${product.name} | HeliPhone Aurora`,
    description: product.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${product.name} | HeliPhone Aurora`,
      description: product.description,
      url,
      images: product.images.map((image) => ({ url: image, alt: product.name })),
      type: "website"
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="overflow-hidden rounded-lg bg-white shadow-soft">
          <Image
            src={product.images[0] || fallbackImage}
            alt={product.name}
            width={1200}
            height={900}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">HeliPhone Aurora</p>
          <h1 className="mt-2 text-4xl font-bold text-ink">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-aurora">{formatCurrency(product.price)}</p>
          <p className="mt-5 leading-8 text-slate-600">{product.description}</p>

          <ProductPurchasePanel product={product} />
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl rounded-lg bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-ink">Thong so ky thuat</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-100 p-4">
              <dt className="text-sm font-semibold capitalize text-slate-500">{key}</dt>
              <dd className="mt-1 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
