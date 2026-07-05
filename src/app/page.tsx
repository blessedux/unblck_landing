import { FixedHeroVideo } from "@/components/FixedHeroVideo";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { InstaAwards } from "@/components/InstaAwards";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      <FixedHeroVideo />
      <PrismaHero />
      <WhatWeDo />
      <InstaAwards />
      <Footer />
    </div>
  );
}
