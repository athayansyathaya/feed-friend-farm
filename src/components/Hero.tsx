import { ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFarm from "@/assets/hero-farm.jpg";

export const Hero = () => {
  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-sky">
      <div className="container relative pt-12 pb-24 lg:pt-16 lg:pb-32">
        <div className="relative mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-foreground/90 shadow-[0_10px_0_0_hsl(var(--foreground)/0.9)]">
            <img
              src={heroFarm}
              alt="Ilustrasi peternakan kartun dengan sapi, domba, dan barn merah"
              width={1280}
              height={896}
              className="h-[360px] w-full object-cover md:h-[480px] lg:h-[560px]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-display text-5xl font-700 leading-[0.95] text-accent drop-shadow-[3px_3px_0_hsl(0_0%_100%)] md:text-7xl lg:text-8xl">
                SmartFeed
              </h1>
              <p className="mt-3 max-w-md font-700 text-foreground bg-card/85 backdrop-blur rounded-full px-5 py-2 text-sm md:text-base shadow-[0_3px_0_0_hsl(var(--foreground)/0.15)]">
                Kalkulator pakan ternak untuk fakultas peternakan
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="hero" size="lg" className="rounded-full" asChild>
              <a href="#kalkulator">
                <Calculator className="h-5 w-5" />
                Hitung Sekarang
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="accent" size="lg" className="rounded-full" asChild>
              <a href="#panduan">Lihat Panduan</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { v: "8+", l: "Jenis Ternak" },
              { v: "100%", l: "Otomatis" },
              { v: "Gratis", l: "untuk Mahasiswa" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-4xl font-700 text-primary">{s.v}</div>
                <div className="text-sm font-600 text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
