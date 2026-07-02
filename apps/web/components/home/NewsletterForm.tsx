"use client";

import { Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { subscribeNewsletter } from "../../lib/services/newsletterService";

const newsletterSchema = z.object({
  email: z.string().email("Email chua hop le.")
});

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.flatten().fieldErrors.email?.[0] ?? "Email chua hop le.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    const ok = await subscribeNewsletter(parsed.data.email);

    if (!ok) {
      setStatus("error");
      setMessage("Chua the dang ky luc nay. Vui long thu lai.");
      return;
    }

    setStatus("success");
    setEmail("");
    setMessage("Dang ky thanh cong. HeliCorp se gui tin moi som nhat.");
  };

  return (
    <section id="newsletter" className="px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-[1fr_0.9fr] lg:items-center dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">Cap nhat san pham</p>
          <h2 className="mt-3 text-3xl font-bold text-ink dark:text-white">Nhan tin moi tu HeliPhone Aurora</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            Dang ky de nhan thong tin mo ban, uu dai va cac ban cap nhat ve dong HeliPhone Aurora.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-ink outline-none ring-aurora/20 focus:border-aurora focus:ring-4 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-aurora px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send size={17} aria-hidden="true" />
              {status === "loading" ? "Dang gui..." : "Dang ky"}
            </button>
          </div>
          {message ? (
            <p
              className={`rounded-lg px-4 py-3 text-sm ${
                status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
