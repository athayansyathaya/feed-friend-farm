import { Beef, Wheat, Sprout, Activity } from "lucide-react";
import { LIVESTOCK, type CalcResult } from "@/lib/feed-calc";

type Props = {
  result: CalcResult | null;
  livestockId: string;
};

export const ResultCard = ({ result, livestockId }: Props) => {
  const ls = LIVESTOCK.find((l) => l.id === livestockId);

  if (!result) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-gradient-warm/40 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-soft">
          <Wheat className="h-8 w-8 text-accent" />
        </div>
        <h3 className="font-display text-xl font-600">Hasil Perhitungan</h3>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Isi formulir dan tekan tombol <strong>Hitung Sekarang</strong> untuk
          melihat kebutuhan pakan harian.
        </p>
      </div>
    );
  }

  const stats = [
    { icon: Beef, label: "Per Ekor / hari", value: `${result.perAnimalKg} kg`, tone: "primary" as const },
    { icon: Wheat, label: "Total / hari", value: `${result.totalKg} kg`, tone: "accent" as const },
    { icon: Sprout, label: "Hijauan", value: `${result.hijauanKg} kg`, tone: "primary" as const },
    { icon: Activity, label: "Konsentrat", value: `${result.konsentratKg} kg`, tone: "primary" as const },
  ];

  return (
    <div className="rounded-3xl bg-gradient-hero p-1 shadow-elevated">
      <div className="rounded-[calc(1.5rem-4px)] bg-card p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            {ls?.emoji}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hasil untuk
            </div>
            <div className="font-display text-xl font-700">{ls?.name}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-background p-4">
              <div
                className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                  s.tone === "accent" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="font-display text-2xl font-700 text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-secondary p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Rekomendasi
          </div>
          <p className="text-sm leading-relaxed text-secondary-foreground">
            {result.recommendation}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
          <span className="text-sm text-muted-foreground">Estimasi Protein</span>
          <span className="font-display text-lg font-700 text-primary">
            {result.proteinG.toLocaleString("id-ID")} g
          </span>
        </div>
      </div>
    </div>
  );
};
