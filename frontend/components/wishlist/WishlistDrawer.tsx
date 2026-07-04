"use client";

import { Heart, X, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useWishlistStore } from "../../lib/store/wishlistStore";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/240x240/111827/ffffff.png?text=HeliPhone";

export function WishlistDrawer() {
  const {
    favorites,
    closeWishlist,
    initializeWishlist,
    isLoading,
    isOpen,
    toggleFavorite,
  } = useWishlistStore();

  useEffect(() => {
    void initializeWishlist();
  }, [initializeWishlist]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeWishlist}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-slate-950/95 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Danh sách yêu thích"
      >
        <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-5 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">
              <Heart size={20} className="fill-red-500" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink dark:text-white">Yêu thích</h2>
              <p className="text-sm font-medium text-slate-500">{favorites.length} sản phẩm</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            className="grid size-10 place-items-center rounded-xl border border-slate-200/50 bg-slate-50/50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Đóng danh sách yêu thích"
          >
            <X size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {isLoading && favorites.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-aurora" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 grid size-24 place-items-center rounded-full bg-slate-50 dark:bg-slate-900">
                <Heart className="text-slate-300 dark:text-slate-700" size={48} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-ink dark:text-white">Danh sách trống</h3>
              <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-slate-500">
                Lưu lại những chiếc điện thoại bạn yêu thích để dễ dàng tìm lại sau.
              </p>
              <button
                onClick={closeWishlist}
                className="mt-8 rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((item, index) => (
                <article 
                  key={item._id} 
                  className="group grid grid-cols-[100px_1fr] gap-4 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-slate-700 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  <Link href={`/san-pham/${item.slug}.html`} onClick={closeWishlist} className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <Image
                      src={item.images[0] || fallbackImage}
                      alt={item.name}
                      width={200}
                      height={200}
                      sizes="100px"
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <div className="flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/san-pham/${item.slug}.html`} onClick={closeWishlist}>
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors hover:text-aurora dark:text-white dark:hover:text-aurora">{item.name}</h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">{item.brand}</p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => void toggleFavorite(item._id)}
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-extrabold text-aurora">{formatCurrency(item.price)}</p>
                      <Link 
                        href={`/san-pham/${item.slug}.html`} 
                        onClick={closeWishlist}
                        className="flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
