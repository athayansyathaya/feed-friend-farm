import { LIVESTOCK } from "@/lib/feed-calc";

export const LivestockGrid = () => {
  return (
    <section id="jenis-ternak" className="bg-gradient-warm/50 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Jenis Ternak Didukung
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 leading-tight md:text-5xl">
            8 jenis ternak untuk semua kebutuhan fakultas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Setiap jenis ternak menggunakan rumus kebutuhan pakan berbasis persen
            bobot tubuh dan rasio hijauan-konsentrat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {LIVESTOCK.map((l) => (
            <div
              key={l.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-3xl transition-smooth group-hover:bg-primary/10">
                {l.emoji}
              </div>
              <div className="mt-4 font-display text-lg font-700">{l.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {(l.dailyFeedPct * 100).toFixed(1)}% berat tubuh / hari
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  Hijauan {Math.round(l.hijauanRatio * 100)}%
                </span>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                  Protein {l.proteinPerKg}g/kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
