"use client";

import { ShoppingCart, Heart, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "../../lib/services/productService";
import { useCartStore } from "../../lib/store/cartStore";
import { useAuthStore } from "../../lib/store/authStore";
import { useWishlistStore } from "../../lib/store/wishlistStore";

type ProductPurchasePanelProps = {
  product: Product;
};

// Helper to get a generic color dot if we don't have exact hex codes
const getColorHex = (colorName: string) => {
  const map: Record<string, string> = {
    "Đen": "#111827",
    "Trắng": "#f8fafc",
    "Xám": "#64748b",
    "Đỏ": "#ef4444",
    "Xanh lá": "#22c55e",
    "Xanh dương": "#3b82f6",
    "Vàng": "#eab308",
    "Hồng": "#ec4899",
    "Tím": "#a855f7",
    "Black": "#111827",
    "White": "#f8fafc",
    "Gray": "#64748b",
    "Red": "#ef4444",
    "Green": "#22c55e",
    "Blue": "#3b82f6",
    "Yellow": "#eab308",
    "Pink": "#ec4899",
    "Purple": "#a855f7",
  };
  
  // Default to a subtle gradient or neutral color if not matched
  return map[colorName] || "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)";
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const t = useTranslations("productDetails");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions[0] ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const isFavorite = useWishlistStore((state) => state.isFavorite(product._id));
  const toggleFavorite = useWishlistStore((state) => state.toggleFavorite);
  const isWishlistLoading = useWishlistStore((state) => state.isLoading);

  const handleAddToCart = async () => {
    if (!user) {
      openAuthModal();
      setMessage(t("loginToCart"));
      return;
    }

    const ok = await addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      storage: selectedStorage,
      quantity: 1
    });

    setMessage(ok ? t("addedToCart") : t("addCartError"));
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      openAuthModal();
      setMessage(t("loginToWishlist"));
      return;
    }

    const ok = await toggleFavorite(product._id);
    if (ok) {
      setMessage(
        !isFavorite ? t("addedToWishlist") : t("removedFromWishlist")
      );
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Colors Section */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t("color")}</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.colors.map((color) => {
            const hex = getColorHex(color);
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`group relative flex items-center gap-3 rounded-full border p-1 pr-4 transition-all duration-300 ${
                  isSelected
                    ? "border-aurora bg-aurora/5 shadow-[0_0_15px_rgba(123,77,255,0.1)]"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                }`}
              >
                <span
                  className="flex size-7 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5"
                  style={{ background: hex }}
                >
                  {isSelected && (
                    <Check size={14} className={hex === "#f8fafc" || hex === "#eab308" ? "text-slate-900" : "text-white"} strokeWidth={3} />
                  )}
                </span>
                <span className={`text-sm font-medium ${isSelected ? "text-aurora" : "text-slate-700 dark:text-slate-300"}`}>
                  {color}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Section */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t("storage")}</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {product.storageOptions.map((storage) => {
            const isSelected = selectedStorage === storage;
            return (
              <button
                key={storage}
                type="button"
                onClick={() => setSelectedStorage(storage)}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 ${
                  isSelected
                    ? "border-aurora bg-aurora/5 text-aurora shadow-[0_0_20px_rgba(123,77,255,0.15)] ring-1 ring-aurora"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span className="text-lg font-bold">{storage}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={isLoading || !selectedColor || !selectedStorage}
            className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-aurora px-8 py-4 text-sm font-bold text-white shadow-[0_8px_25px_rgba(123,77,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(123,77,255,0.35)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:-translate-y-0"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            <ShoppingCart size={20} className={isLoading ? "animate-bounce" : ""} />
            <span>{isLoading ? t("addingToCart") : t("addToCart")}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleToggleFavorite()}
            disabled={isWishlistLoading}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-8 py-4 text-sm font-bold transition-all active:scale-[0.98] sm:w-auto ${
              isFavorite
                ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            <Heart size={20} className={isFavorite ? "fill-red-500" : ""} />
            <span className="hidden sm:inline">{isFavorite ? t("wishlisted") : t("wishlist")}</span>
          </button>
        </div>

        {message && (
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-center text-sm font-medium text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
