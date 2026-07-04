"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-28 pb-10 lg:pt-32 lg:pb-16">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-white dark:bg-slate-950 -z-20" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[1000px] h-[1000px] rounded-full bg-[#E5DFFF] opacity-70 blur-[120px] mix-blend-multiply dark:bg-aurora/20 dark:mix-blend-lighten -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[800px] h-[800px] rounded-full bg-[#DCE4FF] opacity-70 blur-[120px] mix-blend-multiply dark:bg-blue-500/10 dark:mix-blend-lighten -z-10" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16 lg:px-12">
        {/* Left Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-aurora/10 bg-aurora/5 px-4 py-1.5 text-xs font-bold text-aurora uppercase tracking-widest backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora"></span>
            {t("eyebrow")}
          </div>
          
          <h1 className="text-[44px] leading-[1.1] font-bold tracking-tight text-ink sm:text-[56px] lg:text-[60px] xl:text-[72px] dark:text-white">
            <span className="block">{t("title1")}</span>
            <span className="block text-aurora">{t("title2")}</span>
            <span className="block">{t("title3")}</span>
          </h1>
          
          <p className="mt-6 lg:mt-8 max-w-lg text-[15px] sm:text-[17px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {t("description")}
          </p>
          
          <div className="mt-8 lg:mt-10 flex flex-wrap gap-4">
            <Link
              href="/san-pham"
              className="inline-flex h-12 lg:h-14 items-center justify-center gap-2 rounded-full bg-aurora px-6 lg:px-8 text-[14px] lg:text-[15px] font-bold text-white shadow-[0_8px_30px_rgba(123,77,255,0.3)] transition-all hover:bg-[#6b3deb] hover:shadow-[0_12px_40px_rgba(123,77,255,0.4)] active:scale-[0.98]"
            >
              {t("primaryCta")}
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 lg:h-14 items-center justify-center rounded-full border-2 border-slate-200/60 bg-white/20 backdrop-blur-md px-6 lg:px-8 text-[14px] lg:text-[15px] font-bold text-ink hover:bg-white/40 hover:border-slate-300 transition-all active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900/20 dark:text-white dark:hover:bg-slate-800/40"
            >
              {t("secondaryCta")}
            </a>
          </div>
        </div>

        {/* Right Content - Product Image */}
        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] xl:max-w-[420px] mx-auto lg:ml-auto">
          <div className="relative aspect-[0.6] lg:aspect-[0.7] w-full flex items-center justify-center">
            {/* Glow effect behind the image */}
            <div className="absolute inset-0 rounded-full bg-aurora/10 blur-[60px] dark:bg-aurora/20 -z-10" />
            
            <Image
              src="/images/hero-phone.png"
              alt="HeliPhone Aurora"
              width={600}
              height={850}
              className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
