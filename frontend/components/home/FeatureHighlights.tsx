"use client";

import { BatteryCharging, Camera, Cpu, Monitor, Mouse } from "lucide-react";
import { useTranslations } from "next-intl";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    key: "camera",
    icon: Camera
  },
  {
    key: "chip",
    icon: Cpu
  },
  {
    key: "battery",
    icon: BatteryCharging
  },
  {
    key: "screen",
    icon: Monitor
  }
];

export function FeatureHighlights() {
  const t = useTranslations("features");
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

  return (
    <section 
      id="features" 
      ref={ref}
      className={`relative px-6 py-24 bg-surface dark:bg-slate-900/50 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Scroll indicator from Figma */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-12 rounded-full border-2 border-slate-200/60 bg-white/50 backdrop-blur-md flex justify-center pt-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="w-1.5 h-3 rounded-full bg-aurora animate-bounce" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-aurora mb-4">{t("eyebrow")}</p>
          <h2 className="text-[44px] leading-tight font-bold tracking-tight text-ink sm:text-[56px] dark:text-white">
            <span className="block">{t("title1")}</span>
            <span className="block text-aurora mt-1">{t("title2")}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.key} className="rounded-[32px] border border-transparent bg-white p-8 shadow-card hover:shadow-[0_8px_30px_rgba(123,77,255,0.08)] transition-all dark:border-slate-800/50 dark:bg-slate-950">
                <span className="flex size-[60px] items-center justify-center rounded-[20px] bg-aurora/10 text-aurora mb-8">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <h3 className="text-xl font-bold text-ink dark:text-white">{t(`items.${feature.key}.title`)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">{t(`items.${feature.key}.description`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
