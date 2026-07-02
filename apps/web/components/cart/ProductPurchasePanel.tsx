"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../lib/services/productService";
import { useCartStore } from "../../lib/store/cartStore";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions[0] ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const handleAddToCart = async () => {
    const ok = await addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      storage: selectedStorage,
      quantity: 1
    });

    setMessage(ok ? "Da them vao gio hang." : "Chua the them san pham. Vui long thu lai.");
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

      <button
        type="button"
        onClick={() => void handleAddToCart()}
        disabled={isLoading || !selectedColor || !selectedStorage}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-aurora px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        {isLoading ? "Dang them..." : "Them vao gio hang"}
      </button>
      {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
    </div>
  );
}
