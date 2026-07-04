import { Suspense } from "react";
import { OrderSuccessContent } from "../../../components/checkout/OrderSuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <Suspense fallback={<div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-soft">Dang tai don hang...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
