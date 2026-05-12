import { ClipboardList, Calculator, FileBarChart2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Input Data Ternak",
    desc: "Pilih jenis ternak, masukkan jumlah, berat rata-rata, serta kondisi kesehatan.",
  },
  {
    icon: Calculator,
    title: "2. Sistem Menghitung",
    desc: "SmartFeed mengalikan bobot dengan persen kebutuhan harian & faktor kondisi.",
  },
  {
    icon: FileBarChart2,
    title: "3. Lihat Hasil & Riwayat",
    desc: "Dapatkan rekomendasi pakan harian, komposisi hijauan-konsentrat, dan protein.",
  },
];

export const Guide = () => {
  return (
    <section id="panduan" className="container py-16 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          Panduan
        </span>
        <h2 className="mt-4 font-display text-4xl font-700 leading-tight md:text-5xl">
          Cara kerja SmartFeed
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-smooth hover:shadow-card"
          >
            <div className="absolute -right-6 -top-6 font-display text-[7rem] font-700 leading-none text-primary/5">
              {i + 1}
            </div>
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-700">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
