"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../lib/services/productService";
import { useCartStore } from "../../lib/store/cartStore";
import { useAuthStore } from "../../lib/store/authStore";
import { useWishlistStore } from "../../lib/store/wishlistStore";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
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
      setMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    const ok = await addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      storage: selectedStorage,
      quantity: 1
    });

    setMessage(ok ? "Đã thêm vào giỏ hàng." : "Chưa thể thêm sản phẩm. Vui lòng thử lại.");
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      openAuthModal();
      setMessage("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích.");
      return;
    }

    const ok = await toggleFavorite(product._id);
    if (ok) {
      setMessage(
        !isFavorite ? "Đã thêm vào danh sách yêu thích." : "Đã xóa khỏi danh sách yêu thích."
      );
    }
  };

  return (
    <div className="mt-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mau sac</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedColor === color
                  ? "border-aurora bg-aurora text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-aurora"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dung luong</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.storageOptions.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() => setSelectedStorage(storage)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                selectedStorage === storage
                  ? "border-ink bg-ink text-white"
                  : "border-slate-200 bg-white text-ink hover:border-ink"
              }`}
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => void handleAddToCart()}
          disabled={isLoading || !selectedColor || !selectedStorage}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-aurora px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-aurora/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 w-full sm:w-auto"
        >
          <ShoppingCart size={18} aria-hidden="true" />
          {isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </button>

        <button
          type="button"
          onClick={() => void handleToggleFavorite()}
          disabled={isWishlistLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] w-full sm:w-auto ${
            isFavorite
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100/50"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          <Heart size={18} aria-hidden="true" className={isFavorite ? "fill-red-600 text-red-600" : ""} />
          {isFavorite ? "Đã yêu thích" : "Yêu thích"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
