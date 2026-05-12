import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Sprout, Users, Calculator, Wheat, LogOut, TrendingUp, ShieldCheck, KeyRound, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Stats = {
  totalStudents: number;
  totalCalcs: number;
  totalFeedKg: number;
  byLivestock: { name: string; count: number; total: number }[];
  recent: { id: string; livestock_name: string; total_kg: number; created_at: string }[];
};

type UserRow = {
  id: string;
  full_name: string;
  nim: string;
  role: "admin" | "student";
};

const AdminPage = () => {
  const { user, role, loading, signOut } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [adminCode, setAdminCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [savingCode, setSavingCode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const loadAll = async () => {
    const [{ count: students }, { data: calcs }, { data: profiles }, { data: roles }, { data: setting }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("calculations").select("id, livestock_name, total_kg, created_at").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name, nim").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("app_settings").select("value").eq("key", "admin_signup_code").maybeSingle(),
    ]);
    const list = calcs ?? [];
    const map = new Map<string, { count: number; total: number }>();
    list.forEach((c) => {
      const e = map.get(c.livestock_name) ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += Number(c.total_kg);
      map.set(c.livestock_name, e);
    });
    setStats({
      totalStudents: students ?? 0,
      totalCalcs: list.length,
      totalFeedKg: list.reduce((s, c) => s + Number(c.total_kg), 0),
      byLivestock: Array.from(map, ([name, v]) => ({ name, ...v })).sort((a, b) => b.count - a.count),
      recent: list.slice(0, 10),
    });
    const roleMap = new Map((roles ?? []).map((r: any) => [r.user_id, r.role]));
    setUsers((profiles ?? []).map((p: any) => ({ ...p, role: roleMap.get(p.id) ?? "student" })));
    setAdminCode(setting?.value ?? "");
  };

  useEffect(() => {
    if (role !== "admin") return;
    loadAll();
  }, [role]);

  const toggleRole = async (u: UserRow) => {
    if (u.id === user?.id) {
      toast.error("Tidak bisa mengubah peran sendiri");
      return;
    }
    const next: "admin" | "student" = u.role === "admin" ? "student" : "admin";
    const { error } = await supabase
      .from("user_roles")
      .update({ role: next })
      .eq("user_id", u.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${u.full_name} sekarang ${next === "admin" ? "Admin" : "Mahasiswa"}`);
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: next } : x)));
  };

  const saveAdminCode = async () => {
    const v = newCode.trim();
    if (v.length < 6) { toast.error("Kode minimal 6 karakter"); return; }
    setSavingCode(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ value: v, updated_at: new Date().toISOString() })
      .eq("key", "admin_signup_code");
    setSavingCode(false);
    if (error) { toast.error(error.message); return; }
    setAdminCode(v);
    setNewCode("");
    toast.success("Kode admin diperbarui");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-2 border-foreground/10 bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary shadow-[0_3px_0_0_hsl(var(--foreground)/0.2)]">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">
              Smart<span className="text-hay">Feed</span> <span className="text-sm opacity-70">/ Admin</span>
            </span>
          </Link>
          <Button variant="hero" size="sm" className="rounded-full" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">Statistik penggunaan SmartFeed.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Mahasiswa" value={stats?.totalStudents ?? "-"} tint="bg-sky/30" />
          <StatCard icon={<Calculator className="h-5 w-5" />} label="Total Perhitungan" value={stats?.totalCalcs ?? "-"} tint="bg-hay/40" />
          <StatCard icon={<Wheat className="h-5 w-5" />} label="Total Pakan (kg)" value={stats ? Math.round(stats.totalFeedKg) : "-"} tint="bg-accent/20" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border-2 border-foreground/10 bg-card p-6 shadow-[0_4px_0_0_hsl(var(--foreground)/0.08)]">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Per Jenis Ternak
            </h2>
            <div className="mt-4 space-y-3">
              {stats?.byLivestock.length ? stats.byLivestock.map((l) => {
                const max = Math.max(...stats.byLivestock.map((x) => x.count));
                return (
                  <div key={l.name}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted-foreground">{l.count}× · {Math.round(l.total)} kg</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(l.count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              }) : <p className="text-sm text-muted-foreground">Belum ada data.</p>}
            </div>
          </section>

          <section className="rounded-3xl border-2 border-foreground/10 bg-card p-6 shadow-[0_4px_0_0_hsl(var(--foreground)/0.08)]">
            <h2 className="font-display text-xl font-bold">Aktivitas Terbaru</h2>
            <div className="mt-4 space-y-2">
              {stats?.recent.length ? stats.recent.map((r) => (
                <div key={r.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{r.livestock_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <span className="font-display font-bold text-primary">{Number(r.total_kg).toFixed(1)} kg</span>
                </div>
              )) : <p className="text-sm text-muted-foreground">Belum ada perhitungan.</p>}
            </div>
          </section>
        </div>

        {/* Kode Admin */}
        <section className="rounded-3xl border-2 border-foreground/10 bg-card p-6 shadow-[0_4px_0_0_hsl(var(--foreground)/0.08)]">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Kode Rahasia Admin
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Bagikan kode ini hanya kepada calon admin. Mereka memasukkannya saat mendaftar agar otomatis mendapat peran admin.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Kode Aktif</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type={showCode ? "text" : "password"}
                  value={adminCode}
                  className="font-mono"
                />
                <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setShowCode((v) => !v)}>
                  {showCode ? "Sembunyikan" : "Lihat"}
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newCode" className="text-xs">Ganti Kode (min. 6 karakter)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="newCode"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Kode baru"
                  maxLength={64}
                />
                <Button type="button" variant="hero" size="sm" className="rounded-full" disabled={savingCode} onClick={saveAdminCode}>
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Kelola Pengguna */}
        <section className="rounded-3xl border-2 border-foreground/10 bg-card p-6 shadow-[0_4px_0_0_hsl(var(--foreground)/0.08)]">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" /> Kelola Pengguna ({users.length})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Promote mahasiswa menjadi admin atau sebaliknya. Anda tidak bisa mengubah peran sendiri.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-foreground/10 text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Nama</th>
                  <th className="py-2 pr-3">NIM</th>
                  <th className="py-2 pr-3">Peran</th>
                  <th className="py-2 pr-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-3 font-medium">
                        {u.full_name} {isSelf && <span className="text-[10px] text-muted-foreground">(Anda)</span>}
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">{u.nim}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${u.role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {u.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                          {u.role === "admin" ? "Admin" : "Mahasiswa"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <Button
                          type="button"
                          variant={u.role === "admin" ? "outline" : "hero"}
                          size="sm"
                          className="rounded-full"
                          disabled={isSelf}
                          onClick={() => toggleRole(u)}
                        >
                          {u.role === "admin" ? "Jadikan Mahasiswa" : "Jadikan Admin"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {!users.length && (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Belum ada pengguna.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number | string; tint: string }) => (
  <div className="rounded-3xl border-2 border-foreground/10 bg-card p-6 shadow-[0_4px_0_0_hsl(var(--foreground)/0.08)]">
    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}>{icon}</div>
    <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    <p className="font-display text-3xl font-bold">{value}</p>
  </div>
);

export default AdminPage;
