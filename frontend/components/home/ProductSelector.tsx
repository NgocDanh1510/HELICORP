"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, type Product } from "../../lib/services/productService";

export function ProductSelector() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getProducts({ brand: "HeliCorp", limit: 4 });
        setProducts(res.products || []);
      } catch (err) {
        console.error("Failed to load select models", err);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        Đang tải danh sách phiên bản...
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-16 bg-slate-50/50 dark:bg-slate-900/10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">Lựa chọn của bạn</p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl dark:text-white">Chọn phiên bản dành cho bạn</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Tìm kiếm dòng sản phẩm HeliPhone Aurora hoàn hảo phù hợp với phong cách sống và nhu cầu của bạn.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p._id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-950">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink dark:text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-sm font-extrabold text-aurora">{p.price.toLocaleString("vi-VN")} đ</span>
                <Link href={`/san-pham/${p.slug}.html`} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-colors">
                  Chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
