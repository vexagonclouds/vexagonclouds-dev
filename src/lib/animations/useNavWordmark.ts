import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { RefObject } from "react";

// Navbar wordmark fade — the "VexagonClouds" wordmark sits beside the logo on the
// hero, then fades out as you scroll down from the top (gone within the first
// screen, leaving just the hexagon chip + Menu) and fades back in on scroll-up.
// Opacity scrubbed to the scroll, like useNavHandoff; only the wordmark is
// touched, not the chip. The class is passed in (CSS-module names are hashed).
export function useNavWordmark(
  navRef: RefObject<HTMLElement | null>,
  wordClass: string,
) {
  useGSAP(() => {
    const nav = navRef.current;
    const word = nav?.querySelector(`.${wordClass}`);
    if (!word) return;

    gsap.to(word, {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.6,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}
