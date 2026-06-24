import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { Calculator2 } from "@/components/Calculator2";
import { LivestockGrid } from "@/components/LivestockGrid";
import { Guide } from "@/components/Guide";
import { HistorySection } from "@/components/HistorySection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <Calculator2 onSaved={() => setRefreshKey((k) => k + 1)} />
        <LivestockGrid />
        <Guide />
        <HistorySection refreshKey={refreshKey} />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
