"use client";

import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { authRequest } from "../services/authService";
import type { Product } from "../services/productService";

type WishlistState = {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  initializeWishlist: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
  clearWishlist: () => void;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,
  isOpen: false,
  openWishlist: () => set({ isOpen: true }),
  closeWishlist: () => set({ isOpen: false }),
  toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),
  initializeWishlist: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ favorites: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await authRequest("/api/auth/favorites");
      if (response.ok) {
        const data = await response.json();
        set({ favorites: data.favorites || [], isLoading: false });
      } else {
        set({ isLoading: false, error: "Không thể tải danh sách yêu thích" });
      }
    } catch (err) {
      set({ isLoading: false, error: "Lỗi kết nối mạng" });
    }
  },
  toggleFavorite: async (productId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      // Prompt sign in
      useAuthStore.getState().openAuthModal();
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await authRequest("/api/auth/favorites", {
        method: "POST",
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        const data = await response.json();
        set({ favorites: data.favorites || [], isLoading: false });
        return true;
      } else {
        set({ isLoading: false, error: "Không thể cập nhật danh sách yêu thích" });
        return false;
      }
    } catch (err) {
      set({ isLoading: false, error: "Lỗi kết nối mạng" });
      return false;
    }
  },
  isFavorite: (productId) => {
    return get().favorites.some((product) => product._id === productId);
  },
  clearWishlist: () => set({ favorites: [], error: null })
}));
