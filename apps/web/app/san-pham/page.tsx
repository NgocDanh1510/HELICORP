import { getProducts } from "../../lib/services/productService";
import { ProductsView } from "../../components/products/ProductsView";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
};

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
      <ProductsView
        search={params.search}
        total={total}
        products={products}
        page={page}
        pages={pages}
      />
    </main>
  );
}
