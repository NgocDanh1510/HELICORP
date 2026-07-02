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

export async function getProducts(category?: string) {
  const search = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request<{ products: Product[] }>(`/api/products${search}`);

  return data?.products ?? [];
}

export async function getProductBySlug(slug: string) {
  const data = await request<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`);

  return data?.product ?? null;
}
