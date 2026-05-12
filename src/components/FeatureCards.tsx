import tractor from "@/assets/feat-tractor.png";
import field from "@/assets/feat-field.png";
import livestock from "@/assets/feat-livestock.png";

const features = [
  {
    img: tractor,
    title: "Input Cepat",
    desc: "Pilih jenis ternak, masukkan jumlah dan berat — sistem siap menghitung dalam hitungan detik.",
    cta: "Mulai",
  },
  {
    img: field,
    title: "Komposisi Hijauan",
    desc: "Rekomendasi rasio hijauan dan konsentrat otomatis sesuai standar nutrisi tiap ternak.",
    cta: "Pelajari",
  },
  {
    img: livestock,
    title: "8 Jenis Ternak",
    desc: "Sapi, kambing, domba, ayam, kerbau, kelinci — semua siap dihitung dengan akurat.",
    cta: "Lihat",
  },
];

export const FeatureCards = () => {
  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border-2 border-foreground/90 bg-hay px-4 py-1 text-xs font-700 uppercase tracking-widest text-foreground shadow-[0_3px_0_0_hsl(var(--foreground)/0.9)]">
            Fitur Utama
          </span>
          <h2 className="mt-5 font-display text-4xl font-700 text-primary md:text-5xl">
            Solusi lengkap untuk fakultas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tiga langkah sederhana untuk menghitung kebutuhan pakan harian.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-5 w-full overflow-hidden rounded-[2rem] border-4 border-foreground/90 bg-gradient-sky shadow-[0_6px_0_0_hsl(var(--foreground)/0.9)] transition-transform group-hover:-translate-y-1">
                <img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  width={640}
                  height={512}
                  className="h-44 w-full object-contain p-2"
                />
              </div>
              <h3 className="font-display text-2xl font-700 text-accent">{f.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
              <a
                href="#kalkulator"
                className="mt-4 inline-flex rounded-full border-2 border-foreground/90 bg-accent px-5 py-2 text-sm font-700 uppercase tracking-wide text-accent-foreground shadow-[0_3px_0_0_hsl(var(--foreground)/0.9)] transition-transform hover:-translate-y-0.5"
              >
                {f.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
