import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { RefObject } from "react";

type Styles = Record<string, string>;

// Footer — a once-on-enter scroll reveal: the brand mark fades + lifts, the four
// columns rise in a staggered cascade, then the legal bar settles. yPercent /
// y keep the lift resolution-independent. The atmosphere (grain + clouds) always
// renders. Reduced motion returns early (renders settled).
export function useFooter(scope: RefObject<HTMLElement | null>, s: Styles) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(scope);
      const section = scope.current;
      if (!section) return;

      const mark = q(`.${s.mark}`);
      const cols = q(`.${s.col}`);
      const bar = q(`.${s.bar}`);

      gsap.set(mark, { autoAlpha: 0, yPercent: 12 });
      gsap.set(cols, { autoAlpha: 0, y: 28 });
      gsap.set(bar, { autoAlpha: 0, y: 20 });

      gsap
        .timeline({
          defaults: { ease: "power3.out", force3D: true },
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        })
        .to(mark, { autoAlpha: 1, yPercent: 0, duration: 0.9, ease: "power2.out" }, 0.0)
        .to(cols, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.2)
        .to(bar, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7);
    },
    { scope },
  );
}
