"use client";

import Cookies from "js-cookie";
import { create } from "zustand";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
  type AddCartItemInput,
  type Cart,
  type CartItem
} from "../services/cartService";

const SESSION_COOKIE = "helicorp_session_id";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getOrCreateSessionId() {
  const existingSessionId = Cookies.get(SESSION_COOKIE);

  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = createSessionId();
  Cookies.set(SESSION_COOKIE, sessionId, { expires: 30, sameSite: "lax" });

  return sessionId;
}

type CartState = {
  cart: Cart | null;
  sessionId: string | null;
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  itemCount: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  initializeCart: () => Promise<void>;
  addItem: (item: AddCartItemInput) => Promise<boolean>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearLocalCart: () => void;
};

function getTotals(items: CartItem[]) {
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
}

function stateFromCart(cart: Cart | null) {
  const totals = getTotals(cart?.items ?? []);

  return {
    cart,
    ...totals
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  sessionId: null,
  isLoading: false,
  isOpen: false,
  error: null,
  itemCount: 0,
  totalPrice: 0,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  initializeCart: async () => {
    const sessionId = get().sessionId ?? getOrCreateSessionId();

    set({ sessionId, isLoading: true, error: null });

    const cart = await getCart(sessionId);

    if (!cart) {
      set({ isLoading: false, error: "Khong the tai gio hang." });
      return;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
  },
  addItem: async (item) => {
    const sessionId = get().sessionId ?? getOrCreateSessionId();

    set({ sessionId, isLoading: true, error: null });

    const cart = await addCartItem(sessionId, item);

    if (!cart) {
      set({ isLoading: false, error: "Khong the them san pham vao gio." });
      return false;
    }

    set({ ...stateFromCart(cart), isOpen: true, isLoading: false, error: null });
    return true;
  },
  updateItemQuantity: async (itemId, quantity) => {
    const sessionId = get().sessionId;

    if (!sessionId) {
      return false;
    }

    set({ isLoading: true, error: null });

    const cart = await updateCartItem(sessionId, itemId, quantity);

    if (!cart) {
      set({ isLoading: false, error: "Khong the cap nhat gio hang." });
      return false;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
    return true;
  },
  removeItem: async (itemId) => {
    const sessionId = get().sessionId;

    if (!sessionId) {
      return false;
    }

    set({ isLoading: true, error: null });

    const cart = await removeCartItem(sessionId, itemId);

    if (!cart) {
      set({ isLoading: false, error: "Khong the xoa san pham." });
      return false;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
    return true;
  },
  clearLocalCart: () => set({ cart: null, itemCount: 0, totalPrice: 0, isOpen: false })
}));
