"use client";

import { ChevronDown, Sparkles, Heart, Menu, Moon, ShoppingBag, Sun, X, LogOut, Search, Globe2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCartStore } from "../../lib/store/cartStore";
import { useLanguage } from "../providers/AppProviders";
import { useAuthStore } from "../../lib/store/authStore";
import { useWishlistStore } from "../../lib/store/wishlistStore";
import { SearchSuggestions } from "./SearchSuggestions";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  const openWishlist = useWishlistStore((state) => state.openWishlist);

  useEffect(() => {
    void initializeCart();
    void initializeWishlist();
  }, [initializeCart, initializeWishlist]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWishlistClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      openWishlist();
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const navigation = (
    <>
      <Link href="/" className="text-[15px] font-medium text-slate-600 hover:text-aurora transition-colors dark:text-slate-300">
        {t("home")}
      </Link>
      <div className="relative group py-6">
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1 text-[15px] font-medium text-slate-600 hover:text-aurora transition-colors dark:text-slate-300"
        >
          {t("products")}
          <ChevronDown size={14} aria-hidden="true" className="transition-transform group-hover:rotate-180" />
        </Link>
        
        {/* Mega Menu */}
        <div
          className="absolute left-1/2 top-[calc(100%-1.5rem)] z-30 w-[720px] -translate-x-1/2 rounded-[24px] border border-slate-200/50 bg-white/95 backdrop-blur-xl p-8 shadow-[0_18px_60px_rgba(16,24,40,0.08)] dark:border-slate-800/50 dark:bg-slate-950/95 transition-all duration-200 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
        >
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Column 1: Brands */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t("brand")}</p>
              <ul className="space-y-3">
                <li><Link href="/san-pham?brand=HeliCorp" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">HeliCorp</Link></li>
                <li><Link href="/san-pham?brand=Apple" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">Apple</Link></li>
                <li><Link href="/san-pham?brand=Samsung" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">Samsung</Link></li>
              </ul>
            </div>
            {/* Column 2: Categories */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t("category")}</p>
              <ul className="space-y-3">
                <li><Link href="/san-pham?category=Flagship" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">Flagship</Link></li>
                <li><Link href="/san-pham?category=High-end" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">High-end</Link></li>
                <li><Link href="/san-pham?category=Mid-range" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">Mid-range</Link></li>
              </ul>
            </div>
            {/* Column 3: Featured Products */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t("featured")}</p>
              <ul className="space-y-3">
                <li><Link href="/san-pham/heliphone-aurora-pro-max.html" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">HeliPhone Aurora Pro Max</Link></li>
                <li><Link href="/san-pham/iphone-16-pro.html" className="block text-sm font-semibold text-slate-700 hover:text-aurora dark:text-slate-300 dark:hover:text-white transition-colors">iPhone 16 Pro</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
            <Link
              href="/san-pham"
             
              className="block rounded-full bg-slate-50 py-3 text-center text-sm font-bold text-aurora hover:bg-aurora/10 transition-colors dark:bg-slate-900/50 dark:hover:bg-aurora/20"
            >
              {t("allProducts")}
            </Link>
          </div>
        </div>
      </div>
      <a href="#features" className="text-[15px] font-medium text-slate-600 hover:text-aurora transition-colors dark:text-slate-300">
        {t("features")}
      </a>
      <a href="#newsletter" className="text-[15px] font-medium text-slate-600 hover:text-aurora transition-colors dark:text-slate-300">
        {t("contact")}
      </a>
    </>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-soft dark:bg-slate-950/80" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-full bg-aurora text-white shadow-[0_0_15px_rgba(123,77,255,0.4)]">
            <Sparkles size={16} fill="currentColor" />
          </span>
          <span className="text-ink dark:text-white">HeliPhone</span>
          <span className="text-aurora font-light">Aurora</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">{navigation}</nav>

        <div className="hidden items-center gap-5 lg:flex text-slate-600 dark:text-slate-300">
          <SearchSuggestions />

          <button
            type="button"
            onClick={handleWishlistClick}
            className="relative hover:text-aurora transition-colors"
            aria-label={t("wishlist")}
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-aurora px-1 text-[10px] font-bold text-white border-2 border-white dark:border-slate-950">
                {wishlistCount}
              </span>
            )}
          </button>
          
          <button
            type="button"
            onClick={openCart}
            className="relative hover:text-aurora transition-colors"
            aria-label={t("openCart")}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-aurora px-1 text-[10px] font-bold text-white border-2 border-white dark:border-slate-950">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="hover:text-aurora transition-colors"
            aria-label={t("themeToggle")}
          >
            {isMounted && resolvedTheme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>

          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center gap-1.5 hover:text-aurora transition-colors text-[13px] font-bold uppercase tracking-widest"
            title="Đổi ngôn ngữ"
          >
            <Globe2 size={18} strokeWidth={1.5} />
            {label}
          </button>

          {/* User Account Controls */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 dark:border-slate-700/50">
              <span className="flex size-8 items-center justify-center rounded-full bg-aurora/10 text-[11px] font-bold text-aurora dark:bg-aurora/20 dark:text-white" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title={t("logout")}
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="ml-2 inline-flex h-9 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {t("login")}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="grid size-10 place-items-center text-slate-700 lg:hidden dark:text-slate-200"
        >
          {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-24 z-30 bg-white px-6 py-8 transition-all duration-300 lg:hidden dark:bg-slate-950 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Search */}
          <div className="mb-8">
            <SearchSuggestions />
          </div>

          <nav className="flex flex-col gap-6 text-lg font-semibold text-ink dark:text-white">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/san-pham" onClick={() => setIsMenuOpen(false)}>
              {t("products")}
            </Link>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              {t("features")}
            </a>
            <a href="#newsletter" onClick={() => setIsMenuOpen(false)}>
              {t("contact")}
            </a>
          </nav>

          <div className="mt-auto flex flex-col gap-6 border-t border-slate-100 pt-8 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{t("themeToggle")}</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                {isMounted && resolvedTheme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Ngôn ngữ</span>
              <button
                type="button"
                onClick={toggleLocale}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-aurora dark:bg-slate-900"
              >
                <Globe2 size={16} strokeWidth={1.5} />
                {label}
              </button>
            </div>

            {user ? (
              <div className="flex items-center justify-between rounded-xl bg-aurora/5 p-4 border border-aurora/10">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-aurora/20 text-sm font-bold text-aurora">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink dark:text-white">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-slate-400 hover:text-red-500"
                  title={t("logout")}
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuthModal();
                  setIsMenuOpen(false);
                }}
                className="w-full rounded-full bg-ink py-4 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
              >
                {t("login")}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
