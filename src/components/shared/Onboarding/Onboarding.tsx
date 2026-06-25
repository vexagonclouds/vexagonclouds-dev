"use client";

import { useRef } from "react";
import { useOnboarding } from "@/lib/animations/useOnboarding";

// Welcome overlay — ported from the .ob-stage block in design-final/hero.html.
// Proxy Blue at full presence: grain, corner clouds, the watermark P, and the
// centred P-mark over a hairline loader. Styling + arming live in globals.css
// (global .ob-* classes the curtain controller queries). The wordmark is
// intentionally omitted here — only the mark + loader resolve on the welcome.
export function Onboarding() {
  const stage = useRef<HTMLDivElement>(null);
  useOnboarding(stage);

  return (
    <div className="ob-stage pp-theme-blue" ref={stage}>
      <div className="ob-grain" aria-hidden="true" />

      <div className="ob-watermark" aria-hidden="true">
        <img src="/icons/vx-mark.png" alt="" />
      </div>

      <div className="ob-cloud ob-cloud--left" aria-hidden="true">
        <img src="/images/clouds.webp" alt="" />
      </div>
      <div className="ob-cloud ob-cloud--top-right" aria-hidden="true">
        <img src="/images/clouds.webp" alt="" />
      </div>

      <div className="ob-brand" role="img" aria-label="VexagonClouds">
        <img className="ob-lockup" src="/icons/vx-mark.png" alt="" />

        <div className="ob-divider" aria-hidden="true">
          <span className="ob-divider__track" />
          <span className="ob-divider__fill" />
        </div>
      </div>
    </div>
  );
}
