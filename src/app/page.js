"use client";

import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Dynamically import components with animations to avoid hydration issues
const Hero = dynamic(() => import("../components/Hero"), { ssr: false });
const Features = dynamic(() => import("../components/Features"), {
  ssr: false,
});
const Testimonials = dynamic(() => import("../components/Testimonials"), {
  ssr: false,
});
const CTA = dynamic(() => import("../components/CTA"), { ssr: false });

export default function Home() {
  return (
    <main className="main">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
