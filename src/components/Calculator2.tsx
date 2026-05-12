import { useState } from "react";
import { Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  LIVESTOCK,
  HEALTH_OPTIONS,
  calculateFeed,
  saveHistory,
  type CalcResult,
  type HealthCondition,
} from "@/lib/feed-calc";
import { ResultCard } from "./ResultCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  onSaved?: () => void;
};

export const Calculator2 = ({ onSaved }: Props) => {
  const { user } = useAuth();
  const [livestockId, setLivestockId] = useState("sapi-potong");
  const [count, setCount] = useState("10");
  const [weight, setWeight] = useState("350");
  const [health, setHealth] = useState<HealthCondition>("sehat");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalc = async () => {
    const r = calculateFeed({
      livestockId,
      count: Number(count),
      weightKg: Number(weight),
      health,
    });
    if (!r) {
      toast.error("Mohon lengkapi data dengan benar.");
      return;
    }
    setResult(r);
    const ls = LIVESTOCK.find((l) => l.id === livestockId)!;
    const hc = HEALTH_OPTIONS.find((h) => h.id === health)!;
    saveHistory({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      livestockName: ls.name,
      count: Number(count),
      weightKg: Number(weight),
      health: hc.label,
      totalKg: r.totalKg,
    });
    if (user) {
      await supabase.from("calculations").insert({
        user_id: user.id,
        livestock_id: ls.id,
        livestock_name: ls.name,
        count: Number(count),
        weight_kg: Number(weight),
        health: hc.label,
        total_kg: r.totalKg,
        hijauan_kg: r.hijauanKg,
        konsentrat_kg: r.konsentratKg,
        protein_g: r.proteinG,
      });
    }
    onSaved?.();
    toast.success("Perhitungan berhasil disimpan ke riwayat.");
  };

  const handleReset = () => {
    setResult(null);
    setCount("");
    setWeight("");
    setHealth("sehat");
  };

  return (
    <section id="kalkulator" className="container py-16 lg:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Kalkulator Pakan
        </span>
        <h2 className="mt-4 font-display text-4xl font-700 leading-tight md:text-5xl">
          Masukkan data ternak Anda
        </h2>
        <p className="mt-3 text-muted-foreground">
          Sistem akan menghitung kebutuhan pakan harian dan rekomendasi
          komposisi hijauan & konsentrat.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="grid gap-5">
            <Field label="Jenis Ternak">
              <Select value={livestockId} onValueChange={setLivestockId}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIVESTOCK.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      <span className="mr-2">{l.emoji}</span>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Jumlah Ternak (ekor)">
                <Input
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="h-12 rounded-xl"
                  placeholder="cth. 10"
                />
              </Field>
              <Field label="Berat Rata-rata (kg/ekor)">
                <Input
                  type="number"
                  min={1}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 rounded-xl"
                  placeholder="cth. 350"
                />
              </Field>
            </div>

            <Field label="Kondisi Kesehatan / Status">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {HEALTH_OPTIONS.map((h) => {
                  const active = health === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHealth(h.id)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-smooth ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex gap-3 pt-2">
              <Button variant="hero" size="lg" className="flex-1 rounded-xl" onClick={handleCalc}>
                <Calculator className="h-5 w-5" />
                Hitung Sekarang
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        <ResultCard result={result} livestockId={livestockId} />
      </div>
    </section>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold text-foreground">{label}</Label>
    {children}
  </div>
);
