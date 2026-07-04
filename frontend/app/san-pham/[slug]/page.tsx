import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailView } from "../../../components/products/ProductDetailView";
import { getProductBySlug, getProducts } from "../../../lib/services/productService";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/1200x900/111827/ffffff.png?text=HeliPhone";

export async function generateStaticParams() {
  const { products } = await getProducts();

  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: {
        absolute: "San pham khong ton tai | HeliPhone Aurora"
      }
    };
  }

  const url = `${siteUrl}/san-pham/${product.slug}.html`;

  return {
    title: {
      absolute: `${product.name} | HeliPhone Aurora`
    },
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
    <main className="min-h-screen px-6 pt-32 pb-12 lg:pt-40 lg:pb-24 bg-surface dark:bg-slate-950">
      <ProductDetailView product={product} />
    </main>
  );
}
