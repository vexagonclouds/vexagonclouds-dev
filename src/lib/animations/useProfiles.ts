import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { RefObject } from "react";

type Styles = Record<string, string>;

// Per-card fan params (parked state): rotation (deg), horizontal spread and
// vertical lift as fractions of the card's own size. Cards 01..06 fan left→right
// across a centred pile; the actual translation to the pile centre is computed
// from each card's resolved grid slot (offset-based, so it survives refresh).
const FAN: Record<string, { rot: number; spread: number; lift: number }> = {
  "01": { rot: -25, spread: -1.05, lift: 0.1 },
  "02": { rot: -15, spread: -0.62, lift: 0.03 },
  "03": { rot: -5, spread: -0.2, lift: 0.0 },
  "04": { rot: 5, spread: 0.2, lift: 0.0 },
  "05": { rot: 15, spread: 0.62, lift: 0.03 },
  "06": { rot: 25, spread: 1.05, lift: 0.1 },
};
// Centre-out reveal order for the spread + flip stagger.
const ORDER = ["03", "04", "02", "05", "01", "06"];

// Profiles — A's fanned flip-deck, re-choreographed for 6 cards. (A) header rises
// once on enter. (B) desktop: the deck PINS, then a scrubbed timeline winds each
// card out of the centred FRONT fan (un-tilt, spread to its 3×2 slot, flip to the
// BACK face), centre-first, then HOLDS. CSS base is the resolved back-spread, so
// no-JS / reduced motion / mobile land there; reduced motion returns early.
export function useProfiles(scope: RefObject<HTMLElement | null>, s: Styles) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = gsap.utils.selector(scope);
      const section = scope.current;
      if (!section) return;

      // ── A. Header once-reveal ──────────────────────────────────────────────
      const titleWords = q(`.${s.title} .r-word__in`);
      const kicker = q(`.${s.kicker}`);
      const sub = q(`.${s.sub}`);
      gsap.set(titleWords, { yPercent: 120 });
      gsap.set([...kicker, ...sub], { autoAlpha: 0, y: 18 });
      gsap
        .timeline({
          defaults: { ease: "power3.out", force3D: true },
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        })
        .to(kicker, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to(titleWords, { yPercent: 0, duration: 0.7, stagger: 0.05 }, 0.1)
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.45);

      // ── B. Deck — choreographed per breakpoint ────────────────────────────
      const deck = section.querySelector<HTMLElement>(`.${s.deck}`);
      if (!deck) return;
      const cards = ORDER.map((id) =>
        section.querySelector<HTMLElement>(`[data-profile="${id}"]`),
      ).filter((c): c is HTMLElement => !!c);
      const pos = cards.map((c) => c.querySelector(`.${s.cardPos}`));
      const flips = cards.map((c) => c.querySelector(`.${s.cardFlip}`));

      const mm = gsap.matchMedia();

      // Desktop ≥1024: pinned scrub. Park each card at the centred fan, then wind
      // out to its slot and flip. Fan offset = (deck centre − slot centre) using
      // offset geometry (untransformed), so onRefresh recomputes correctly.
      mm.add("(min-width: 1024px)", () => {
        const parkFan = () => {
          const dcx = deck.clientWidth / 2;
          const dcy = deck.clientHeight / 2;
          cards.forEach((c, i) => {
            const f = FAN[c.dataset.profile ?? "03"];
            const ccx = c.offsetLeft + c.offsetWidth / 2;
            const ccy = c.offsetTop + c.offsetHeight / 2;
            gsap.set(pos[i], {
              x: dcx - ccx + f.spread * c.offsetWidth,
              y: dcy - ccy - f.lift * c.offsetHeight,
              rotation: f.rot,
              force3D: true,
            });
          });
        };
        parkFan();
        gsap.set(flips, { rotationY: 0, force3D: true });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=100%",
              pin: true,
              pinType: "transform",
              anticipatePin: 1,
              scrub: 1.5,
              invalidateOnRefresh: true,
              onRefresh: parkFan,
            },
          })
          .to(
            pos,
            { x: 0, y: 0, rotation: 0, duration: 1.2, stagger: 0.12, ease: "power1.inOut", force3D: true },
            0,
          )
          .to(
            flips,
            { rotationY: 180, duration: 1.4, stagger: 0.12, ease: "power1.inOut", force3D: true },
            0.35,
          )
          .to({}, { duration: 0.9 });

        ScrollTrigger.refresh();
      });

      // Tablet + mobile <1024: vertical stack on the info (back) face; a light
      // per-card rise-in, no pin. (cardPos/flip stay at CSS base.)
      mm.add("(max-width: 1023px)", () => {
        gsap.from(cards, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );
}
