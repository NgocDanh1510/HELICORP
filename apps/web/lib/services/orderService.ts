import type { CartItem } from "./cartService";

export type CreateOrderInput = {
  sessionId: string;
  customerName: string;
  phone: string;
  address: string;
};

export type OrderSummary = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function createOrder(input: CreateOrderInput) {
  try {
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as { orderId: string };
  } catch {
    return null;
  }
}
