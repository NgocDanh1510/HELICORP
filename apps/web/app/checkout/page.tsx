"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CreditCard, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrder, type OrderSummary } from "../../lib/services/orderService";
import { useCartStore } from "../../lib/store/cartStore";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Vui long nhap ho ten."),
  phone: z.string().min(8, "So dien thoai chua hop le."),
  address: z.string().min(5, "Vui long nhap dia chi giao hang.")
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearLocalCart, initializeCart, isLoading, sessionId, totalPrice } = useCartStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const items = useMemo(() => cart?.items ?? [], [cart]);

  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: ""
    }
  });

  useEffect(() => {
    void initializeCart();
  }, [initializeCart]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!sessionId || items.length === 0) {
      setSubmitError("Gio hang dang trong hoac chua san sang.");
      return;
    }

    setIsSubmittingOrder(true);
    setSubmitError(null);

    const result = await createOrder({ sessionId, ...values });

    if (!result) {
      setIsSubmittingOrder(false);
      setSubmitError("Chua the tao don hang. Vui long thu lai.");
      return;
    }

    const summary: OrderSummary = {
      orderId: result.orderId,
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      items,
      totalPrice
    };

    sessionStorage.setItem("helicorp_last_order", JSON.stringify(summary));
    clearLocalCart();
    router.push(`/checkout/thanh-cong?orderId=${encodeURIComponent(result.orderId)}`);
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <Link href="/san-pham" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-aurora">
          <ArrowLeft size={16} aria-hidden="true" />
          Quay lai san pham
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-aurora text-white">
                <CreditCard size={20} aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-ink">Thong tin dat hang</h1>
                <p className="text-sm text-slate-500">Nhan vien HeliCorp se lien he xac nhan sau khi dat hang.</p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Ho ten</span>
                <input
                  {...register("customerName")}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-aurora/20 focus:border-aurora focus:ring-4"
                  placeholder="Nguyen Van A"
                />
                {errors.customerName ? <span className="mt-1 block text-sm text-red-500">{errors.customerName.message}</span> : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">So dien thoai</span>
                <input
                  {...register("phone")}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-aurora/20 focus:border-aurora focus:ring-4"
                  placeholder="0901234567"
                />
                {errors.phone ? <span className="mt-1 block text-sm text-red-500">{errors.phone.message}</span> : null}
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Dia chi giao hang</span>
                <textarea
                  {...register("address")}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none ring-aurora/20 focus:border-aurora focus:ring-4"
                  placeholder="So nha, duong, phuong/xa, quan/huyen, tinh/thanh"
                />
                {errors.address ? <span className="mt-1 block text-sm text-red-500">{errors.address.message}</span> : null}
              </label>
            </div>

            {submitError ? <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p> : null}

            <button
              type="submit"
              disabled={isSubmittingOrder || isLoading || items.length === 0}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-aurora px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              <PackageCheck size={18} aria-hidden="true" />
              {isSubmittingOrder ? "Dang tao don..." : "Dat hang"}
            </button>
          </form>

          <aside className="h-fit rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-ink">Tom tat don hang</h2>
            {items.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-500">
                Gio hang dang trong. Hay quay lai danh sach san pham de chon HeliPhone Aurora.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <article key={item._id} className="flex gap-3">
                    <img
                      src={item.image || "https://placehold.co/160x160/111827/ffffff.png?text=HeliPhone"}
                      alt={item.name}
                      className="size-16 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 text-sm font-semibold text-ink">{item.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.color} / {item.storage} x {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-aurora">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </article>
                ))}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Tong tien</span>
                    <span className="text-lg font-bold text-ink">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
