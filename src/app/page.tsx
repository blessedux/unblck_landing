import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { InstaAwards } from "@/components/InstaAwards";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhatWeDo />
        <InstaAwards />
      </main>
      <Footer />
    </div>
  );
}
