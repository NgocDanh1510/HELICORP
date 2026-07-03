"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;

    if (val && val !== "newest") {
      params.set("sort", val);
    } else {
      params.delete("sort");
    }

    // Reset to page 1 on sort change
    params.delete("page");

    router.push(`/san-pham?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Sắp xếp:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-700 outline-none transition-all focus:border-aurora dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="newest">Mới nhất</option>
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
      </select>
    </div>
  );
}
