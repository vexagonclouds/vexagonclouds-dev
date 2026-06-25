import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { RefObject } from "react";

type Styles = Record<string, string>;

// Contact reveal — kicker fades in, then the form fields + actions settle up in
// a stagger. Once on enter; reduced motion returns early (renders settled).
export function useContact(scope: RefObject<HTMLElement | null>, s: Styles) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(scope);
      const section = scope.current;
      if (!section) return;

      const kicker = q(`.${s.kicker}`);
      const fields = q(`.${s.field}`);
      const actions = q(`.${s.actions}`);

      gsap.set(kicker, { autoAlpha: 0, y: 18 });
      gsap.set([...fields, ...actions], { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          defaults: { ease: "power3.out", force3D: true },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        })
        .to(kicker, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to([...fields, ...actions], { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.15);

      ScrollTrigger.refresh();
    },
    { scope },
  );
}
