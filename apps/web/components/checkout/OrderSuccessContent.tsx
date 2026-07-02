"use client";

import { CheckCircle2, Home, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { OrderSummary } from "../../lib/services/orderService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
const fallbackImage = "https://placehold.co/160x160/111827/ffffff.png?text=HeliPhone";

export function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("orderId") ?? "";
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const rawSummary = sessionStorage.getItem("helicorp_last_order");

    if (!rawSummary) {
      return;
    }

    try {
      setSummary(JSON.parse(rawSummary) as OrderSummary);
    } catch {
      sessionStorage.removeItem("helicorp_last_order");
    }
  }, []);

  const orderId = summary?.orderId || orderIdFromUrl;

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-lg bg-white p-8 text-center shadow-soft">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={36} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-ink">Dat hang thanh cong</h1>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
          Cam on ban da dat mua HeliPhone Aurora. Doi ngu HeliCorp se lien he xac nhan thong tin giao hang trong thoi gian som nhat.
        </p>
        {orderId ? (
          <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Ma don hang: <span className="font-semibold text-ink">{orderId}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
          <ShoppingBag size={20} aria-hidden="true" />
          Tom tat san pham
        </h2>

        {summary?.items.length ? (
          <div className="mt-5 space-y-4">
            {summary.items.map((item) => (
              <article key={item._id} className="flex gap-4 rounded-lg border border-slate-200 p-3">
                <Image
                  src={item.image || fallbackImage}
                  alt={item.name}
                  width={80}
                  height={80}
                  sizes="80px"
                  className="size-20 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.color} / {item.storage} x {item.quantity}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-aurora">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </article>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm text-slate-500">Tong tien</span>
              <span className="text-lg font-bold text-ink">{formatCurrency(summary.totalPrice)}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-500">
            Khong tim thay tom tat don hang tren trinh duyet nay. Ma don hang van duoc ghi nhan neu hien thi o phan tren.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white">
          <Home size={18} aria-hidden="true" />
          Ve trang chu
        </Link>
        <Link href="/san-pham" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink">
          Tiep tuc xem san pham
        </Link>
      </div>
    </section>
  );
}
