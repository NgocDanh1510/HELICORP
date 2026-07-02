import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-aurora">HeliPhone Aurora</p>
          <h1 className="text-4xl font-bold tracking-normal text-ink sm:text-6xl">
            Dien thoai flagship cho ngay lam viec sang tao.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Kham pha dong HeliPhone Aurora voi man hinh OLED, camera AI va thiet ke cao cap.
          </p>
          <Link
            href="/san-pham"
            className="mt-8 inline-flex rounded-lg bg-aurora px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Xem san pham
          </Link>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-[radial-gradient(circle_at_30%_25%,#B8A1FF,transparent_32%),linear-gradient(135deg,#121826,#6E42F5)] shadow-soft" />
      </section>
    </main>
  );
}
