"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ProductPurchasePanel } from "../cart/ProductPurchasePanel";
import type { Product } from "../../lib/services/productService";

type ProductDetailViewProps = {
  product: Product;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/1200x900/111827/ffffff.png?text=HeliPhone";

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const t = useTranslations("productDetails");

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        {/* Left Column - Product Image (Sticky) */}
        <div className="relative">
          <div className="sticky top-28 lg:top-32 rounded-3xl p-6 lg:p-12 transition-all">
            {/* Soft backdrop glow effect */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-aurora/5 blur-2xl dark:bg-aurora/10" />
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-3xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:from-slate-900/80 dark:to-slate-900/20 dark:border-slate-800/80" />
            
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-square flex items-center justify-center">
              <Image
                src={product.images[0] || fallbackImage}
                alt={product.name}
                width={1200}
                height={1200}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-[90%] w-[90%] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col justify-center pt-4 lg:pt-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-aurora/10 bg-aurora/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aurora backdrop-blur-md">
              {product.brand}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl dark:text-white">
              {product.name}
            </h1>
            <p className="mt-6 text-3xl font-bold text-aurora sm:text-4xl">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300">
              {product.description}
            </p>
          </div>

          <div className="my-10 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800" />

          {/* Product Purchase Panel (Client Component) */}
          <ProductPurchasePanel product={product} />

          <div className="my-12 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800" />

          {/* Technical Specifications */}
          <section>
            <h2 className="text-xl font-bold text-ink dark:text-white">{t("techSpecs")}</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div 
                  key={key} 
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {key}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {value}
                  </dd>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-aurora transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
