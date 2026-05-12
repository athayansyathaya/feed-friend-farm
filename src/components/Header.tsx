import { Sprout, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Beranda", href: "#beranda" },
  { label: "Kalkulator", href: "#kalkulator" },
  { label: "Jenis Ternak", href: "#jenis-ternak" },
  { label: "Riwayat", href: "#riwayat" },
  { label: "Panduan", href: "#panduan" },
];

export const Header = () => {
  const { user, role, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-foreground/10 bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between gap-6">
        <a href="#beranda" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary shadow-[0_3px_0_0_hsl(var(--foreground)/0.2)]">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-700 tracking-tight">
            Smart<span className="text-hay">Feed</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-700 uppercase tracking-wide text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {role === "admin" && (
                <Button variant="hero" size="sm" className="rounded-full" asChild>
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
                </Button>
              )}
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold">
                <UserIcon className="h-3.5 w-3.5" /> {user.email?.split("@")[0]}
              </span>
              <Button variant="ghost" size="sm" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="hero" size="sm" className="rounded-full" asChild>
              <Link to="/auth">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
