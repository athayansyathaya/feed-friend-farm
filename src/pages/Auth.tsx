import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const nimToEmail = (nim: string) => `${nim.trim()}@smartfeed.kampus`;

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  nim: z.string().trim().regex(/^[0-9A-Za-z]{4,20}$/, "NIM 4-20 karakter alfanumerik"),
  password: z.string().min(6, "Password minimal 6 karakter").max(72),
  adminCode: z.string().trim().max(64).optional(),
});

const Auth = () => {
  const nav = useNavigate();
  const { user, role, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      nav(role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, role, loading, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ fullName, nim, password, adminCode });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: nimToEmail(nim),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              nim: nim.trim(),
              ...(adminCode.trim() ? { admin_code: adminCode.trim() } : {}),
            },
          },
        });
        if (error) throw error;
        toast.success(adminCode.trim() ? "Pendaftaran berhasil! Cek role admin Anda." : "Pendaftaran berhasil! Anda otomatis masuk.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: nimToEmail(nim),
          password,
        });
        if (error) throw error;
        toast.success("Selamat datang!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Terjadi kesalahan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky/30 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(var(--foreground)/0.2)]">
            <Sprout className="h-6 w-6" />
          </span>
          <span className="font-display text-3xl font-bold">
            Smart<span className="text-accent">Feed</span>
          </span>
        </Link>

        <div className="rounded-3xl border-2 border-foreground/10 bg-card p-8 shadow-[0_8px_0_0_hsl(var(--foreground)/0.1)]">
          <h1 className="font-display text-2xl font-bold text-center">
            {mode === "login" ? "Masuk Mahasiswa" : "Daftar Mahasiswa"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {mode === "login" ? "Gunakan NIM & password Anda" : "Isi data untuk akun baru"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="nim">NIM</Label>
              <Input id="nim" value={nim} onChange={(e) => setNim(e.target.value)} required maxLength={20} placeholder="2024010001" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {mode === "signup" && (
              <div className="pt-1">
                {!showAdminField ? (
                  <button
                    type="button"
                    onClick={() => setShowAdminField(true)}
                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2"
                  >
                    Punya kode admin? Klik di sini
                  </button>
                ) : (
                  <div className="space-y-1.5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3">
                    <Label htmlFor="adminCode" className="text-xs">Kode Admin (opsional)</Label>
                    <Input
                      id="adminCode"
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      maxLength={64}
                      placeholder="Masukkan kode rahasia admin"
                      autoComplete="off"
                    />
                    <p className="text-[11px] text-muted-foreground">Kosongkan jika daftar sebagai mahasiswa biasa.</p>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full rounded-full" disabled={busy}>
              {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
