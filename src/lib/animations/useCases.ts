import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { RefObject } from "react";

type Styles = Record<string, string>;

// Cases reveal — a once-on-enter cascade in A's house style: the header rises
// (kicker → title words → sub), then the case cards settle up in a stagger.
// Renders settled by default (SSR / reduced motion returns early).
export function useCases(scope: RefObject<HTMLElement | null>, s: Styles) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(scope);
      const section = scope.current;
      if (!section) return;

      const titleWords = q(`.${s.title} .r-word__in`);
      const kicker = q(`.${s.kicker}`);
      const sub = q(`.${s.sub}`);
      const cards = q(`.${s.card}`);
      const more = q(`.${s.more}`); // home-only "View more" CTA (empty on /portfolio)

      gsap.set(titleWords, { yPercent: 120 });
      gsap.set([...kicker, ...sub], { autoAlpha: 0, y: 18 });
      gsap.set(cards, { autoAlpha: 0, y: 32 });
      gsap.set(more, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3D: true },
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to(titleWords, { yPercent: 0, duration: 0.7, stagger: 0.05 }, 0.1)
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.45)
        .to(cards, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.55)
        .to(more, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.85);

      ScrollTrigger.refresh();
    },
    { scope },
  );
}
