"use client";

import { ChevronDown, Globe2, Heart, Menu, Moon, ShoppingBag, Sun, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCartStore } from "../../lib/store/cartStore";
import { useLanguage } from "../providers/AppProviders";
import { useAuthStore } from "../../lib/store/authStore";
import { SearchSuggestions } from "./SearchSuggestions";
import { useWishlistStore } from "../../lib/store/wishlistStore";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations("header");
  const { label, toggleLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const initializeCart = useCartStore((state) => state.initializeCart);
  const itemCount = useCartStore((state) => state.itemCount);
  const openCart = useCartStore((state) => state.openCart);

  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const logout = useAuthStore((state) => state.logout);

  const wishlistCount = useWishlistStore((state) => state.favorites.length);
  const initializeWishlist = useWishlistStore((state) => state.initializeWishlist);

  useEffect(() => {
    void initializeCart();
    void initializeWishlist();
  }, [initializeCart, initializeWishlist]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleWishlistClick = () => {
    if (!user) {
      openAuthModal();
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const navigation = (
    <>
      <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-200">
        {t("home")}
      </Link>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsProductsOpen((value) => !value)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-200"
          aria-expanded={isProductsOpen}
        >
          {t("products")}
          <ChevronDown size={16} aria-hidden="true" />
        </button>
        
        {/* Mega Menu */}
        <div
          className={`mt-2 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl lg:absolute lg:left-1/2 lg:top-8 lg:z-30 lg:mt-0 lg:w-[640px] lg:-translate-x-1/2 dark:border-slate-800 dark:bg-slate-950 transition-all ${
            isProductsOpen ? "block" : "hidden"
          }`}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Column 1: Brands */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Thương hiệu</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/san-pham?brand=HeliCorp" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    HeliCorp
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham?brand=Apple" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Apple (iPhone)
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham?brand=Samsung" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Samsung
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham?brand=Xiaomi" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Xiaomi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Phân khúc</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/san-pham?category=Flagship" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Flagship (Cao cấp)
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham?category=High-end" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    High-end (Cận cao cấp)
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham?category=Mid-range" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Mid-range (Tầm trung)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Featured Products */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Nổi bật</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/san-pham/heliphone-aurora-pro-max.html" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    HeliPhone Aurora Pro Max
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham/iphone-16-pro.html" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    iPhone 16 Pro
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham/galaxy-s25-ultra.html" onClick={() => setIsProductsOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white">
                    Galaxy S25 Ultra
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Link
              href="/san-pham"
              onClick={() => setIsProductsOpen(false)}
              className="block rounded-xl bg-slate-50 py-2.5 text-center text-xs font-bold text-aurora hover:bg-slate-100 transition-colors dark:bg-slate-900/50 dark:hover:bg-slate-900"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </div>
      <a href="#features" className="text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-200">
        {t("features")}
      </a>
      <a href="#newsletter" className="text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-200">
        {t("signup")}
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink dark:text-white">
          <span className="grid size-9 place-items-center rounded-lg bg-aurora text-white">H</span>
          HeliCorp
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">{navigation}</nav>

        <div className="hidden items-center gap-2 lg:flex">
          {/* Autocomplete Search Suggestions */}
          <SearchSuggestions />

          <button
            type="button"
            onClick={handleWishlistClick}
            className="relative grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label={t("wishlist")}
          >
            <Heart size={18} aria-hidden="true" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-aurora px-1 text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label={t("openCart")}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-aurora px-1 text-[11px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label={t("themeToggle")}
          >
            {isMounted && resolvedTheme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Globe2 size={16} aria-hidden="true" />
            {label}
          </button>

          {/* User Account Controls */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
              <span className="flex size-9 items-center justify-center rounded-full bg-aurora/10 text-xs font-bold text-aurora dark:bg-aurora/25 dark:text-white" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-red-500 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Đăng nhập
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-200"
          aria-label={t("menu")}
        >
          {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          {/* Mobile Search suggestions */}
          <div className="mb-4">
            <SearchSuggestions />
          </div>

          <nav className="flex flex-col gap-4">{navigation}</nav>
          <div className="mt-5 grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleWishlistClick}
              className="relative grid h-10 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label={t("wishlist")}
            >
              <Heart size={18} aria-hidden="true" />
              {wishlistCount > 0 ? (
                <span className="absolute right-2 top-1 grid min-w-5 place-items-center rounded-full bg-aurora px-1 text-[11px] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={openCart}
              className="relative grid h-10 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label={t("openCart")}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {itemCount > 0 ? (
                <span className="absolute right-2 top-1 grid min-w-5 place-items-center rounded-full bg-aurora px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label={t("themeToggle")}
            >
              {isMounted && resolvedTheme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              <Globe2 size={16} aria-hidden="true" />
              {label}
            </button>
          </div>

          {/* Mobile Auth Row */}
          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-aurora/10 text-xs font-bold text-aurora dark:bg-aurora/25 dark:text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuthModal();
                  setIsMenuOpen(false);
                }}
                className="flex w-full h-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
