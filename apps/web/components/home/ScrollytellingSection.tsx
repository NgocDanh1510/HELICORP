"use client";

import { BatteryCharging, Camera, Cpu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const storyItems = [
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
  }
];

export function ScrollytellingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("story");

  useEffect(() => {
    let cleanup = () => {};

    async function initAnimation() {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(min-width: 768px)", () => {
          gsap.fromTo(
            phoneRef.current,
            { y: 70, rotate: -5, scale: 0.92 },
            {
              y: -20,
              rotate: 4,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 78%",
                end: "bottom 22%",
                scrub: true
              }
            }
          );

          gsap.from("[data-story-card]", {
            y: 36,
            opacity: 0,
            duration: 0.7,
            stagger: 0.16,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%"
            }
          });
        });

        media.add("(max-width: 767px)", () => {
          gsap.from("[data-story-card]", {
            y: 18,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%"
            }
          });
        });

        return () => media.revert();
      }, sectionRef);

      cleanup = () => context.revert();
    }

    void initAnimation();

    return () => cleanup();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div ref={phoneRef} className="relative min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-6 shadow-soft dark:border-slate-800">
          <div className="absolute left-1/2 top-10 h-[300px] w-[190px] -translate-x-1/2 rounded-[34px] border-8 border-slate-900 bg-gradient-to-br from-aurora via-[#44C2FF] to-[#11D7A3] shadow-2xl">
            <div className="mx-auto mt-4 h-5 w-20 rounded-full bg-slate-950/80" />
            <div className="absolute bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border border-white/30 bg-white/10" />
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
            <p className="text-sm font-semibold">{t("phoneLabel")}</p>
            <p className="mt-1 text-xs leading-5 text-white/70">{t("phoneDescription")}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl dark:text-white">{t("title")}</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{t("description")}</p>

          <div className="mt-8 space-y-4">
            {storyItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.key} data-story-card className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-aurora/10 text-aurora">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-white">{t(`items.${item.key}.title`)}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(`items.${item.key}.description`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
