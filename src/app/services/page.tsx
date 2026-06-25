import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Services } from "@/components/sections/Services";
import { EiySys } from "@/components/sections/EiySys";
import { Tracks } from "@/components/sections/Tracks";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Services — VexagonClouds",
  description:
    "The full range of what VexagonClouds delivers — AWS expertise, AI adoption, digital transformation, scalable development, and seamless migration — plus how we engage.",
};

// /services — the "More services" destination from the home capabilities deck.
// Composed from existing pieces: the Services grid (the 5 capabilities), the
// engagement Tracks, the Contact form, and the shared Footer. No Onboarding (the
// Navbar reveals its logo on mount when no welcome curtain is present).
export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <Services />
      <EiySys />
      <Tracks />
      <Contact />
      <Footer />
    </>
  );
}
