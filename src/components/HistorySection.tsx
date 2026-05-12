import { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearHistory, loadHistory, type HistoryEntry } from "@/lib/feed-calc";
import { toast } from "sonner";

type Props = { refreshKey: number };

export const HistorySection = ({ refreshKey }: Props) => {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, [refreshKey]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
    toast.success("Riwayat dihapus.");
  };

  return (
    <section id="riwayat" className="container py-16 lg:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <History className="h-3.5 w-3.5" /> Riwayat
          </span>
          <h2 className="mt-4 font-display text-4xl font-700 leading-tight md:text-5xl">
            Riwayat Perhitungan
          </h2>
          <p className="mt-3 text-muted-foreground">
            20 perhitungan terakhir tersimpan otomatis di perangkat Anda.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={handleClear} className="rounded-full">
            <Trash2 className="h-4 w-4" />
            Hapus semua
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <History className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-600">Belum ada riwayat</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Lakukan perhitungan untuk melihat riwayat di sini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Jenis</th>
                  <th className="px-6 py-4 font-semibold">Jumlah</th>
                  <th className="px-6 py-4 font-semibold">Berat</th>
                  <th className="px-6 py-4 font-semibold">Kondisi</th>
                  <th className="px-6 py-4 text-right font-semibold">Total / hari</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((it) => (
                  <tr key={it.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(it.date).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">{it.livestockName}</td>
                    <td className="px-6 py-4">{it.count} ekor</td>
                    <td className="px-6 py-4">{it.weightKg} kg</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {it.health}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-display text-base font-700 text-primary">
                      {it.totalKg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
