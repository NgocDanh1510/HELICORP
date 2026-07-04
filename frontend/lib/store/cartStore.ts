"use client";

import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
  type AddCartItemInput,
  type Cart,
  type CartItem
} from "../services/cartService";

type CartState = {
  cart: Cart | null;
  sessionId: string | null; // Kept for compatibility, returns user ID if logged in
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
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ cart: null, itemCount: 0, totalPrice: 0, sessionId: null, isLoading: false });
      return;
    }

    set({ sessionId: user.id, isLoading: true, error: null });

    const cart = await getCart();

    if (!cart) {
      set({ isLoading: false, error: "Không thể tải giỏ hàng." });
      return;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
  },
  addItem: async (item) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      // Prompt sign in
      useAuthStore.getState().openAuthModal();
      return false;
    }

    set({ sessionId: user.id, isLoading: true, error: null });

    const cart = await addCartItem(item);

    if (!cart) {
      set({ isLoading: false, error: "Không thể thêm sản phẩm vào giỏ." });
      return false;
    }

    set({ ...stateFromCart(cart), isOpen: true, isLoading: false, error: null });
    return true;
  },
  updateItemQuantity: async (itemId, quantity) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return false;
    }

    set({ isLoading: true, error: null });

    const cart = await updateCartItem(itemId, quantity);

    if (!cart) {
      set({ isLoading: false, error: "Không thể cập nhật giỏ hàng." });
      return false;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
    return true;
  },
  removeItem: async (itemId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return false;
    }

    set({ isLoading: true, error: null });

    const cart = await removeCartItem(itemId);

    if (!cart) {
      set({ isLoading: false, error: "Không thể xóa sản phẩm." });
      return false;
    }

    set({ ...stateFromCart(cart), isLoading: false, error: null });
    return true;
  },
  clearLocalCart: () => set({ cart: null, itemCount: 0, totalPrice: 0, isOpen: false, sessionId: null })
}));
