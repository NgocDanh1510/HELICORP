"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { getProducts, type Product } from "../../lib/services/productService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/120x90/111827/ffffff.png?text=HeliPhone";

export function SearchSuggestions() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const result = await getProducts({ search: query, limit: 5 });
        setSuggestions(result.products);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/san-pham?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/san-pham/${slug}.html`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[280px]">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Tìm kiếm điện thoại..."
            className="w-full h-10 rounded-full border border-slate-200 bg-slate-50 pl-4 pr-10 text-xs text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-slate-400" />
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            ) : (
              <Search size={16} className="text-slate-400" />
            )}
          </div>
        </div>
      </form>

      {/* Suggestion list */}
      {isOpen && (query.trim() !== "") && (
        <div className="absolute right-0 top-11 z-50 w-[320px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-950">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-sm text-slate-400">
              <Loader2 size={18} className="animate-spin mr-2" />
              Đang tìm kiếm...
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Gợi ý sản phẩm</p>
              <div className="space-y-1">
                {suggestions.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleSuggestionClick(product.slug)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-50 transition-colors dark:hover:bg-slate-900"
                  >
                    <Image
                      src={product.images[0] || fallbackImage}
                      alt={product.name}
                      width={44}
                      height={33}
                      sizes="44px"
                      className="aspect-[4/3] rounded bg-slate-100 dark:bg-slate-900 object-contain p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-semibold text-ink dark:text-white">{product.name}</h4>
                      <p className="text-[10px] text-slate-500">{product.brand} • {product.category}</p>
                      <p className="text-xs font-bold text-aurora mt-0.5">{formatCurrency(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/san-pham?search=${encodeURIComponent(query.trim())}`);
                }}
                className="mt-2 block w-full rounded-lg bg-slate-50 py-2 text-center text-xs font-bold text-aurora hover:bg-slate-100 transition-colors dark:bg-slate-900/50 dark:hover:bg-slate-900"
              >
                Xem tất cả kết quả
              </button>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              Không tìm thấy sản phẩm "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
