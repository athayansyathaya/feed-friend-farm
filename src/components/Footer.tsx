import { Sprout } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-700">SmartFeed</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">
              Sistem perhitungan pakan ternak untuk fakultas peternakan.
              Akurat, cepat, mudah digunakan oleh mahasiswa & peternak.
            </p>
          </div>

          {[
            { title: "Sistem", items: ["Beranda", "Kalkulator", "Jenis Ternak", "Riwayat"] },
            { title: "Akademik", items: ["Mata Kuliah", "Praktikum", "Dokumentasi"] },
            { title: "Bantuan", items: ["Panduan", "FAQ", "Kontak"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-base font-700">{col.title}</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/75">
                {col.items.map((i) => (
                  <li key={i} className="cursor-pointer transition-colors hover:text-primary-foreground">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/70 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} SmartFeed Calculation System — Fakultas Peternakan.</p>
          <p>Dibuat untuk RPL — Kelompok 3</p>
        </div>
      </div>
    </footer>
  );
};
