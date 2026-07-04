export type CartItem = {
  _id: string;
  productId: string;
  slug: string;
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
  slug: string;
  name: string;
  price: number;
  color: string;
  storage: string;
  quantity: number;
  image?: string;
};

import { authRequest } from "./authService";

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await authRequest(path, {
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

export async function getCart() {
  const data = await request<{ cart: Cart }>("/api/cart");

  return data?.cart ?? null;
}

export async function addCartItem(item: AddCartItemInput) {
  const data = await request<{ cart: Cart }>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify(item)
  });

  return data?.cart ?? null;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const data = await request<{ cart: Cart }>(
    `/api/cart/items/${encodeURIComponent(itemId)}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }
  );

  return data?.cart ?? null;
}

export async function removeCartItem(itemId: string) {
  const data = await request<{ cart: Cart }>(
    `/api/cart/items/${encodeURIComponent(itemId)}`,
    {
      method: "DELETE"
    }
  );

  return data?.cart ?? null;
}
