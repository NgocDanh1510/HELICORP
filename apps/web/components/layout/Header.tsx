"use client";

import { ChevronDown, Globe2, Heart, Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCartStore } from "../../lib/store/cartStore";
import { useLanguage } from "../providers/AppProviders";

const productLinks = [
  {
    key: "aurora",
    href: "/san-pham/heliphone-aurora.html"
  },
  {
    key: "pro",
    href: "/san-pham/heliphone-aurora-pro.html"
  },
  {
    key: "proMax",
    href: "/san-pham/heliphone-aurora-pro-max.html"
  }
];

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

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        <div
          className={`mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 shadow-soft lg:absolute lg:left-1/2 lg:top-8 lg:z-30 lg:mt-0 lg:w-[520px] lg:-translate-x-1/2 dark:border-slate-800 dark:bg-slate-950 ${
            isProductsOpen ? "block" : "hidden"
          }`}
        >
          <div className="grid gap-2 lg:grid-cols-3">
            {productLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsProductsOpen(false)}
                className="rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="block text-sm font-semibold text-ink dark:text-white">{t(`productsList.${item.key}.label`)}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{t(`productsList.${item.key}.description`)}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/san-pham"
            onClick={() => setIsProductsOpen(false)}
            className="mt-2 block rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-aurora dark:bg-slate-900"
          >
            {t("allProducts")}
          </Link>
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
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label={t("wishlist")}
          >
            <Heart size={18} aria-hidden="true" />
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
          <nav className="flex flex-col gap-4">{navigation}</nav>
          <div className="mt-5 grid grid-cols-4 gap-2">
            <button
              type="button"
              className="grid h-10 place-items-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              aria-label={t("wishlist")}
            >
              <Heart size={18} aria-hidden="true" />
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
        </div>
      ) : null}
    </header>
  );
}
