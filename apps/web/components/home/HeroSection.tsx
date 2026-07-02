import { ArrowRight, Cpu, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-aurora/20 bg-aurora/10 px-3 py-1 text-sm font-semibold text-aurora">
            <Sparkles size={16} aria-hidden="true" />
            HeliPhone Aurora Series
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-ink sm:text-6xl dark:text-white">
            HeliPhone Aurora
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Dong smartphone flagship voi man hinh OLED ruc ro, camera AI va thiet ke cao cap cho cong viec, sang tao va giai tri moi ngay.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 rounded-lg bg-aurora px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              Kham pha san pham
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-aurora dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              Xem tinh nang
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["120Hz", "OLED LTPO"],
              ["50MP", "Camera AI"],
              ["65W", "Sac nhanh"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <p className="text-2xl font-bold text-ink dark:text-white">{value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <div className="absolute inset-x-10 bottom-0 top-12 rounded-[32px] bg-gradient-to-br from-slate-950 via-[#27145f] to-aurora shadow-soft" />
          <Image
            src="https://placehold.co/900x1100/111827/ffffff.png?text=HeliPhone+Aurora"
            alt="HeliPhone Aurora"
            width={900}
            height={1100}
            priority
            sizes="(min-width: 1024px) 340px, 70vw"
            className="absolute left-1/2 top-0 h-[420px] w-[70%] max-w-[340px] -translate-x-1/2 rounded-[34px] border-8 border-slate-950 object-cover shadow-2xl"
          />
          <div className="absolute bottom-8 left-0 flex max-w-[260px] items-center gap-3 rounded-lg border border-white/20 bg-white/90 p-4 shadow-soft dark:bg-slate-950/90">
            <span className="grid size-10 place-items-center rounded-lg bg-aurora text-white">
              <Cpu size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink dark:text-white">Heli A1 Neural</p>
              <p className="text-xs leading-5 text-slate-500">Xu ly AI on-device nhanh va rieng tu.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
