import { BatteryCharging, Camera, Cpu, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Camera AI Pro",
    description: "Tu dong can bang anh chan dung, dem va video chuyen dong nhanh voi tone mau tu nhien."
  },
  {
    icon: Cpu,
    title: "Heli A1 Neural",
    description: "Chip flagship toi uu tac vu AI, game va da nhiem nhung van tiet kiem nang luong."
  },
  {
    icon: BatteryCharging,
    title: "Pin ca ngay",
    description: "Vien pin lon ket hop sac nhanh 65W giup quay lai cong viec chi sau mot khoang nghi ngan."
  },
  {
    icon: ShieldCheck,
    title: "Vat lieu cao cap",
    description: "Khung titanium hoac aluminum, mat kinh ben bi va kha nang chong vet xuoc tot hon."
  }
];

export function FeatureHighlights() {
  return (
    <section id="features" className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">Tinh nang noi bat</p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl dark:text-white">
            Moi chi tiet duoc toi uu cho trai nghiem flagship.
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            HeliPhone Aurora tap trung vao nhung thu nguoi dung cham den moi ngay: man hinh, camera, hieu nang va pin.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <span className="grid size-11 place-items-center rounded-lg bg-aurora/10 text-aurora">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
