"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function ScrollytellingSection() {
  const t = useTranslations("story");

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Section 1: Photography */}
      <section className="px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
          {/* Left: Image */}
          <div className="relative aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl bg-[#111]">
            <Image
              src="/images/camera.jpg"
              alt="Camera Lenses"
              fill
              className="object-cover opacity-90"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* Right: Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full bg-aurora/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-aurora mb-6">
              {t("section1.eyebrow")}
            </div>
            <h2 className="text-[40px] leading-[1.1] font-bold tracking-tight text-ink sm:text-5xl dark:text-white">
              {t("section1.title")}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-slate-500 dark:text-slate-400">
              {t("section1.description")}
            </p>
            <div className="mt-12 w-full border-t border-slate-200/80 dark:border-slate-800/80" />
          </div>
        </div>
      </section>

      {/* Section 2: Performance */}
      <section className="px-6 py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
          {/* Left: Content (Order 2 on mobile, Order 1 on Desktop) */}
          <div className="max-w-xl order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full bg-aurora/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-aurora mb-6">
              {t("section2.eyebrow")}
            </div>
            <h2 className="text-[40px] leading-[1.1] font-bold tracking-tight text-ink sm:text-5xl dark:text-white">
              {t("section2.title")}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-slate-500 dark:text-slate-400">
              {t("section2.description")}
            </p>
            <div className="mt-12 w-full border-t border-slate-200/80 dark:border-slate-800/80" />
          </div>

          {/* Right: Image (Order 1 on mobile, Order 2 on Desktop) */}
          <div className="relative aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl bg-[#0a1128] order-1 lg:order-2">
            <Image
              src="/images/chip.jpg"
              alt="Performance Chip"
              fill
              className="object-cover opacity-90"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
