 "use client";

import { BatteryCharging, Camera, Cpu, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  {
    key: "camera",
    icon: Camera,
  },
  {
    key: "chip",
    icon: Cpu,
  },
  {
    key: "battery",
    icon: BatteryCharging,
  },
  {
    key: "material",
    icon: ShieldCheck,
  }
];

export function FeatureHighlights() {
  const t = useTranslations("features");

  return (
    <section id="features" className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            {t("description")}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <span className="grid size-11 place-items-center rounded-lg bg-aurora/10 text-aurora">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink dark:text-white">{t(`items.${feature.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t(`items.${feature.key}.description`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
