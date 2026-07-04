"use client";

import { Minus, Plus, ShoppingBag, X, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "../../lib/store/cartStore";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/240x240/111827/ffffff.png?text=HeliPhone";

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
        className={`fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-slate-950/95 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Giỏ hàng"
      >
        <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-5 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-aurora/10 text-aurora">
              <ShoppingBag size={20} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink dark:text-white">Giỏ hàng</h2>
              <p className="text-sm font-medium text-slate-500">{cart?.items.length ?? 0} sản phẩm</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-xl border border-slate-200/50 bg-slate-50/50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Đóng giỏ hàng"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {isLoading && !cart ? (
            <div className="flex h-full items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-aurora" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 grid size-24 place-items-center rounded-full bg-slate-50 dark:bg-slate-900">
                <ShoppingBag className="text-slate-300 dark:text-slate-700" size={48} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-ink dark:text-white">Giỏ hàng trống</h3>
              <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-slate-500">
                Hãy chọn một mẫu HeliPhone Aurora để bắt đầu mua sắm.
              </p>
              <button
                onClick={closeCart}
                className="mt-8 rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <article 
                  key={item._id} 
                  className="group grid grid-cols-[100px_1fr] gap-4 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-slate-700 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <Link href={`/san-pham/${item.slug || item.productId}.html`} onClick={closeCart} className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <Image
                      src={item.image || fallbackImage}
                      alt={item.name}
                      width={200}
                      height={200}
                      sizes="100px"
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <div className="flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/san-pham/${item.slug || item.productId}.html`} onClick={closeCart}>
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors hover:text-aurora dark:text-white dark:hover:text-aurora">{item.name}</h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {item.color} • {item.storage}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => void removeItem(item._id)}
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex h-9 items-center rounded-lg border border-slate-200/80 bg-slate-50/50 p-1 dark:border-slate-700/80 dark:bg-slate-900/50">
                        <button
                          type="button"
                          onClick={() =>
                            item.quantity <= 1
                              ? void removeItem(item._id)
                              : void updateItemQuantity(item._id, item.quantity - 1)
                          }
                          className="grid size-7 place-items-center rounded-md bg-white text-slate-600 shadow-sm transition-colors hover:text-aurora dark:bg-slate-800 dark:text-slate-300 dark:hover:text-aurora"
                          aria-label="Giảm số lượng"
                        >
                          <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-ink dark:text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => void updateItemQuantity(item._id, item.quantity + 1)}
                          className="grid size-7 place-items-center rounded-md bg-white text-slate-600 shadow-sm transition-colors hover:text-aurora dark:bg-slate-800 dark:text-slate-300 dark:hover:text-aurora"
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                      </div>
                      
                      <p className="text-sm font-extrabold text-aurora">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/50 bg-white/50 px-6 py-6 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/50">
          <div className="mb-5 flex items-end justify-between">
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Tổng tiền</span>
            <span className="text-2xl font-extrabold text-ink dark:text-white tracking-tight">{formatCurrency(totalPrice)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={closeCart}
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-4 text-sm font-bold transition-all ${
              cart?.items.length
                ? "bg-aurora text-white shadow-[0_8px_25px_rgba(123,77,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(123,77,255,0.35)] active:translate-y-0"
                : "pointer-events-none bg-slate-100 text-slate-400 dark:bg-slate-900"
            }`}
          >
            {cart?.items.length ? (
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
            ) : null}
            <span>Tiến hành đặt hàng</span>
            <ArrowRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </aside>
    </>
  );
}
