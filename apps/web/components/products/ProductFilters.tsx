"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getProductFilters } from "../../lib/services/productService";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("productsPage.filters");

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch filters on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getProductFilters();
        setAvailableBrands(data.brands);
        setAvailableCategories(data.categories);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    }
    loadFilters();
  }, []);

  // Sync selected filters with URL searchParams
  useEffect(() => {
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
    const categories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
    
    setSelectedBrands(brands);
    setSelectedCategories(categories);
  }, [searchParams]);

  const updateUrl = (updatedBrands: string[], updatedCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updatedBrands.length > 0) {
      params.set("brand", updatedBrands.join(","));
    } else {
      params.delete("brand");
    }

    if (updatedCategories.length > 0) {
      params.set("category", updatedCategories.join(","));
    } else {
      params.delete("category");
    }

    // Always reset page to 1 when filters change
    params.delete("page");

    router.push(`/san-pham?${params.toString()}`);
  };

  const handleBrandChange = (brand: string) => {
    const isSelected = selectedBrands.includes(brand);
    const updated = isSelected 
      ? selectedBrands.filter((b) => b !== brand) 
      : [...selectedBrands, brand];
    
    setSelectedBrands(updated);
    updateUrl(updated, selectedCategories);
  };

  const handleCategoryChange = (category: string) => {
    const isSelected = selectedCategories.includes(category);
    const updated = isSelected 
      ? selectedCategories.filter((c) => c !== category) 
      : [...selectedCategories, category];
    
    setSelectedCategories(updated);
    updateUrl(selectedBrands, updated);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brand");
    params.delete("category");
    params.delete("page");
    router.push(`/san-pham?${params.toString()}`);
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0;

  return (
    <div className="space-y-8 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-bold text-ink dark:text-white">{t("title")}</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            {t("clear")}
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t("brand")}</h3>
        {availableBrands.length === 0 ? (
          <p className="text-xs text-slate-500">{t("loading")}</p>
        ) : (
          <div className="space-y-2.5">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="size-4 rounded border-slate-200 text-aurora focus:ring-aurora/20 dark:border-slate-800 dark:bg-slate-900"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t("category")}</h3>
        {availableCategories.length === 0 ? (
          <p className="text-xs text-slate-500">{t("loading")}</p>
        ) : (
          <div className="space-y-2.5">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="size-4 rounded border-slate-200 text-aurora focus:ring-aurora/20 dark:border-slate-800 dark:bg-slate-900"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
