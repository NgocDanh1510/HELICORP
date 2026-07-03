"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function ProductPagination({ currentPage, totalPages }: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    router.push(`/san-pham?${params.toString()}`);
  };

  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Prev Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => handlePageChange(num)}
          className={`flex size-10 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
            currentPage === num
              ? "bg-aurora text-white shadow-lg shadow-aurora/20"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
