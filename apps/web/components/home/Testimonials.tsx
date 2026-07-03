"use client";

export function Testimonials() {
  const reviews = [
    {
      name: "Nguyễn Văn A",
      role: "Nhà sáng tạo nội dung",
      text: "Camera của Aurora Pro thực sự tuyệt vời. Khả năng chụp đêm siêu sắc nét, quay video chống rung cực đỉnh.",
      rating: 5,
      avatar: "A"
    },
    {
      name: "Trần Thị B",
      role: "Doanh nhân",
      text: "Thiết kế titanium siêu nhẹ và sang trọng. Thời lượng pin cực trâu giúp tôi làm việc cả ngày dài không lo hết pin.",
      rating: 5,
      avatar: "B"
    },
    {
      name: "Phạm Minh C",
      role: "Game thủ chuyên nghiệp",
      text: "Chip Helio X1 xử lý mượt mà mọi tựa game nặng nhất ở cấu hình cao nhất mà không bị nóng máy. Quá hài lòng!",
      rating: 5,
      avatar: "C"
    }
  ];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-aurora">Đánh giá thực tế</p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl dark:text-white">Khách hàng nói gì về Aurora?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <article key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {"★".repeat(r.rating)}
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">"{r.text}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="flex size-9 items-center justify-center rounded-full bg-aurora/10 text-xs font-bold text-aurora dark:bg-aurora/25 dark:text-white">{r.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-ink dark:text-white">{r.name}</h4>
                  <p className="text-[10px] text-slate-400">{r.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
