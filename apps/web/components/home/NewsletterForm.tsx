"use client";

import { Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState, useRef, useEffect } from "react";
import { z } from "zod";
import { subscribeNewsletter } from "../../lib/services/newsletterService";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newsletterSchema = z.object({
      email: z.string().email(t("invalid"))
    });
    const parsed = newsletterSchema.safeParse({ email });

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.flatten().fieldErrors.email?.[0] ?? t("invalid"));
      return;
    }

    setStatus("loading");
    setMessage(null);

    const ok = await subscribeNewsletter(parsed.data.email);

    if (!ok) {
      setStatus("error");
      setMessage(t("error"));
      return;
    }

    setStatus("success");
    setEmail("");
    setMessage(t("success"));
  };

  return (
    <section 
      id="newsletter" 
      ref={ref}
      className={`px-6 py-24 bg-surface dark:bg-slate-950 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex size-[60px] items-center justify-center rounded-full bg-aurora/10 text-aurora">
          <Mail size={28} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-[44px] leading-tight font-bold tracking-tight text-ink sm:text-[56px] dark:text-white">
          <span className="block">{t("title1")}</span>
          <span className="block text-aurora mt-1">{t("title2")}</span>
        </h2>
        
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-slate-500 dark:text-slate-400">
          {t("description")}
        </p>

        <form onSubmit={handleSubmit} className="mt-12 mx-auto max-w-[540px]">
          <label className="sr-only" htmlFor="newsletter-email">
            {t("emailLabel")}
          </label>
          <div className="relative flex h-16 w-full items-center rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgba(16,24,40,0.04)] ring-1 ring-slate-200/50 dark:bg-slate-900/50 dark:ring-slate-800">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-full flex-1 rounded-full bg-transparent px-6 text-[15px] text-ink outline-none placeholder:text-slate-400 dark:text-white"
              placeholder={t("placeholder")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-full rounded-full bg-aurora px-8 text-[15px] font-bold text-white transition-all hover:bg-[#6b3deb] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status === "loading" ? t("submitting") : t("submit")}
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} />
            <span>{t("privacy")}</span>
          </div>

          {message ? (
            <p
              className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
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
