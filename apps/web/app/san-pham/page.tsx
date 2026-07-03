import Link from "next/link";
import Image from "next/image";
import { getProducts } from "../../lib/services/productService";
import { ProductFilters } from "../../components/products/ProductFilters";
import { ProductSort } from "../../components/products/ProductSort";
import { ProductPagination } from "../../components/products/ProductPagination";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/1200x900/111827/ffffff.png?text=HeliPhone";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);
  
  const { products, total, page, pages } = await getProducts({
    category: params.category,
    brand: params.brand,
    search: params.search,
    sort: params.sort,
    page: currentPage,
    limit: 6
  });

  return (
    <main className="min-h-screen px-6 pt-32 pb-12 lg:pt-40 lg:pb-24 bg-surface dark:bg-slate-950">
      <section className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">Cửa hàng</p>
          <h1 className="text-4xl font-bold text-ink dark:text-white">
            {params.search ? `Kết quả tìm kiếm cho "${params.search}"` : "Danh sách điện thoại"}
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Khám phá các dòng điện thoại cao cấp nhất từ HeliCorp, Apple, Samsung và Xiaomi với chính sách giá ưu đãi và trả góp 0%.
          </p>
        </div>

        {/* Catalog Layout */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Left Sidebar Filters */}
          <aside className="h-fit lg:sticky lg:top-20">
            <ProductFilters />
          </aside>

          {/* Right Content Area */}
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 dark:border-slate-800/80 dark:bg-slate-950">
              <p className="text-sm text-slate-500">
                Tìm thấy <span className="font-bold text-ink dark:text-white">{total}</span> sản phẩm
              </p>
              <ProductSort />
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                Không tìm thấy sản phẩm nào khớp với bộ lọc đã chọn.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <article key={product._id} className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-850 dark:bg-slate-950">
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900">
                        <Image
                          src={product.images[0] || fallbackImage}
                          alt={product.name}
                          width={1200}
                          height={900}
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow dark:bg-slate-900/90 dark:text-slate-300">
                          {product.brand}
                        </span>
                      </div>
                      <div className="mt-4 px-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</p>
                        <h2 className="mt-1 text-lg font-bold text-ink dark:text-white line-clamp-1">{product.name}</h2>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{product.description}</p>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 px-1 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-aurora">{formatCurrency(product.price)}</span>
                      <Link
                        href={`/san-pham/${product.slug}.html`}
                        className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            <ProductPagination currentPage={page} totalPages={pages} />
          </div>
        </div>
      </section>
    </main>
  );
}
