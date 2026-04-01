"use client";

import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import CanvasMoment from "@/components/landing/CanvasMoment";
import FeaturesBento from "@/components/landing/FeaturesBento";
import KnowledgeGraph from "@/components/landing/KnowledgeGraph";
import Testimonials from "@/components/landing/Testimonials";
import { Stats, Pricing, CtaSection, Footer } from "@/components/landing/StatsPricingCta";

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#070E09", color: "#EDE8E0", overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <CanvasMoment />
      <FeaturesBento />
      <KnowledgeGraph />
      <Testimonials />
      <Stats />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  );
}
