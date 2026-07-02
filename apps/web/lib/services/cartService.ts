export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  color: string;
  storage: string;
  quantity: number;
  image?: string;
};

export type Cart = {
  _id: string;
  sessionId: string;
  items: CartItem[];
};

export type AddCartItemInput = {
  productId: string;
  name: string;
  price: number;
  color: string;
  storage: string;
  quantity: number;
  image?: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers
      }
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCart(sessionId: string) {
  const data = await request<{ cart: Cart }>(`/api/cart/${encodeURIComponent(sessionId)}`);

  return data?.cart ?? null;
}

export async function addCartItem(sessionId: string, item: AddCartItemInput) {
  const data = await request<{ cart: Cart }>(`/api/cart/${encodeURIComponent(sessionId)}/items`, {
    method: "POST",
    body: JSON.stringify(item)
  });

  return data?.cart ?? null;
}

export async function updateCartItem(sessionId: string, itemId: string, quantity: number) {
  const data = await request<{ cart: Cart }>(
    `/api/cart/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }
  );

  return data?.cart ?? null;
}

export async function removeCartItem(sessionId: string, itemId: string) {
  const data = await request<{ cart: Cart }>(
    `/api/cart/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: "DELETE"
    }
  );

  return data?.cart ?? null;
}
