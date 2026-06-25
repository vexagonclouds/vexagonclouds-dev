import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Contact — VexagonClouds",
  description:
    "Tell us about your project. We'll get back to you within one business day to schedule a free strategy session.",
};

// /contact — the Contact Us menu tab. Reuses the Contact form section; the bone
// lead spacer clears the fixed navbar and matches the section's light ground so
// there's no dark gap above it. No Onboarding (Navbar reveals its logo on mount).
export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="subpage-lead subpage-lead-light">
        <Contact />
      </div>
      <Footer />
    </>
  );
}
