import { HeroSection } from "@/components/ui/hero-section-5";
import { WhatWeDo } from "@/components/WhatWeDo";
import { InstaAwards } from "@/components/InstaAwards";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhatWeDo />
      <InstaAwards />
      <Footer />
    </div>
  );
}
