export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  specs: {
    display: string;
    chip: string;
    camera: string;
    battery: string;
    material: string;
  };
  colors: string[];
  storageOptions: string[];
  category: string;
  brand: string;
};

export type GetProductsParams = {
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type GetProductsResult = {
  products: Product[];
  total: number;
  page: number;
  pages: number;
};

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiUrl}${path}`, { next: { revalidate: 60 } });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResult> {
  const query = new URLSearchParams();
  if (params.category) query.append("category", params.category);
  if (params.brand) query.append("brand", params.brand);
  if (params.search) query.append("search", params.search);
  if (params.sort) query.append("sort", params.sort);
  if (params.page) query.append("page", String(params.page));
  query.append("limit", String(params.limit ?? 100));

  const data = await request<GetProductsResult>(`/api/products?${query.toString()}`);

  return data ?? { products: [], total: 0, page: 1, pages: 1 };
}

export async function getProductFilters() {
  const data = await request<{ brands: string[]; categories: string[] }>("/api/products/filters");
  return data ?? { brands: [], categories: [] };
}

export async function getProductBySlug(slug: string) {
  const data = await request<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`);

  return data?.product ?? null;
}
