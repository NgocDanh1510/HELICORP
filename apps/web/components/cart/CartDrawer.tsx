"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "../../lib/store/cartStore";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export function CartDrawer() {
  const {
    cart,
    closeCart,
    initializeCart,
    isLoading,
    isOpen,
    removeItem,
    totalPrice,
    updateItemQuantity
  } = useCartStore();

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white shadow-soft transition-transform duration-300 dark:bg-slate-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Gio hang"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-aurora text-white">
              <ShoppingBag size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-ink dark:text-white">Gio hang</h2>
              <p className="text-sm text-slate-500">{cart?.items.length ?? 0} san pham</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Dong gio hang"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && !cart ? (
            <p className="text-sm text-slate-500">Dang tai gio hang...</p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 text-slate-300" size={44} aria-hidden="true" />
              <p className="font-semibold text-ink dark:text-white">Gio hang dang trong</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Hay chon mot mau HeliPhone Aurora de bat dau.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <article key={item._id} className="grid grid-cols-[84px_1fr] gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <img
                    src={item.image || "https://placehold.co/240x240/111827/ffffff.png?text=HeliPhone"}
                    alt={item.name}
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-2 font-semibold text-ink dark:text-white">{item.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.color} / {item.storage}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeItem(item._id)}
                        className="grid size-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                        aria-label="Xoa san pham"
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() =>
                            item.quantity <= 1
                              ? void removeItem(item._id)
                              : void updateItemQuantity(item._id, item.quantity - 1)
                          }
                          className="grid size-9 place-items-center text-slate-600 dark:text-slate-300"
                          aria-label="Giam so luong"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink dark:text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => void updateItemQuantity(item._id, item.quantity + 1)}
                          className="grid size-9 place-items-center text-slate-600 dark:text-slate-300"
                          aria-label="Tang so luong"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-aurora">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">Tong tien</span>
            <span className="text-lg font-bold text-ink dark:text-white">{formatCurrency(totalPrice)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white ${
              cart?.items.length ? "bg-aurora" : "pointer-events-none bg-slate-300"
            }`}
          >
            Tien hanh dat hang
          </Link>
        </div>
      </aside>
    </>
  );
}
