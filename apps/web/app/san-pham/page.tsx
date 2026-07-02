import Link from "next/link";
import { getProducts } from "../../lib/services/productService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">San pham</p>
          <h1 className="text-4xl font-bold text-ink">HeliPhone Aurora</h1>
          <p className="max-w-2xl text-slate-600">
            Chon phien ban phu hop voi nhu cau lam viec, chup anh va giai tri cua ban.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            Chua co du lieu san pham. Hay chay seed va dam bao Express API dang hoat dong.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product._id} className="overflow-hidden rounded-lg bg-white shadow-soft">
                <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-ink">{product.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
                  <p className="mt-4 text-lg font-bold text-aurora">{formatCurrency(product.price)}</p>
                  <Link
                    href={`/san-pham/${product.slug}.html`}
                    className="mt-5 inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
                  >
                    Xem chi tiet
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
