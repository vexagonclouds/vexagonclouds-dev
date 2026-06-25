import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Cases } from "@/components/sections/Cases";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Portfolio — VexagonClouds",
  description:
    "Real engagements, measurable outcomes — a snapshot of how VexagonClouds has helped teams move faster on the cloud.",
};

// /portfolio — the Portfolio menu tab. Reuses the Cases section (8 case studies);
// the dark lead spacer clears the fixed navbar (Cases is dark, so it's seamless
// over the dark body ground). No Onboarding (Navbar reveals its logo on mount).
export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <div className="subpage-lead">
        <Cases />
      </div>
      <Footer />
    </>
  );
}
