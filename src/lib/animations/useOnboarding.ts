import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis/LenisProvider";
import { useIntro } from "@/lib/intro/IntroProvider";
import type { RefObject } from "react";

const MARK_SRC = "/icons/vx-mark.png";

// Onboarding intro + curtain handoff — ported from setupOnboardingIntro() and
// runCurtain() in design-final/scripts/hero.js (the one controller that merges
// onboarding → hero). The welcome resolves on a clock (scroll is locked), then
// the curtain wipes the blue overlay away bottom-up while the held crest settles
// into the hero's lens card and the hero assembles around it. On landing the
// scroll lock releases. Reduced motion / no overlay → land straight on the hero.
//
// NOTE: the mark is the VexagonClouds hexagon crest — a single raster, so unlike
// the original two-part P-mark it resolves and flies as ONE unit (no stem/blade
// assemble, no per-part recolor). Every other beat (watermark, clouds, divider,
// curtain wipe, hero handoff, scroll release) is unchanged.
export function useOnboarding(stageRef: RefObject<HTMLDivElement | null>) {
  const lenisRef = useLenis();
  const intro = useIntro();

  useGSAP(() => {
    const root = document.documentElement;
    const obStage = stageRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Hand the page over to normal scrolling once the welcome resolves.
    const release = () => {
      root.classList.add("pp-ready");
      lenisRef?.current?.start();
      ScrollTrigger.refresh();
    };

    const lockup = obStage?.querySelector<HTMLImageElement>(".ob-lockup");

    // Settled path — reduced motion or no overlay: drop the welcome (removing
    // `js` hides the overlay + unlocks scroll via CSS) and land on the hero.
    if (reduced || !obStage || !lockup) {
      root.classList.remove("js");
      return;
    }

    // ── Resolve (setupOnboardingIntro) ───────────────────────────────────────
    // The crest is a single raster, so it resolves as one unit — eased up from
    // slightly small + low rather than assembled from two halves. It's
    // armed-hidden in CSS (html.js .ob-lockup).
    gsap.set(lockup, {
      opacity: 0,
      scale: 0.92,
      y: 16,
      transformOrigin: "center center",
    });

    const q = gsap.utils.selector(obStage);
    const obTl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });

    obTl
      .to(q(".ob-watermark"), { opacity: 0.2, duration: 1.6, ease: "power2.out" }, 0)
      .fromTo(
        q(".ob-cloud--left"),
        { opacity: 0, xPercent: -6 },
        { opacity: 1, xPercent: 0, duration: 1.8, ease: "power2.out" },
        0,
      )
      .fromTo(
        q(".ob-cloud--top-right"),
        { opacity: 0, yPercent: -5 },
        { opacity: 1, yPercent: 0, duration: 1.8, ease: "power2.out" },
        0.1,
      );

    obTl.to(lockup, { opacity: 1, scale: 1, y: 0, duration: 0.9 }, 0.35);

    obTl.fromTo(
      q(".ob-divider__fill"),
      { width: "0%" },
      { width: "100%", duration: 1.7, ease: "none" },
      0.35,
    );

    // ── Curtain handoff (runCurtain) ─────────────────────────────────────────
    let fly: HTMLImageElement | null = null;

    const runCurtain = () => {
      const hero = intro?.getHero();
      const navLogo = document.querySelector("[data-nav-logo]");
      const divider = q(".ob-divider");
      // The hero card + its mark live OUTSIDE the ob-stage scope, so they must be
      // animated by element reference — useGSAP scopes selector strings to the
      // stage, where they don't exist.
      const card = document.querySelector("[data-axis-card]");
      const cardImg = card?.querySelector("img") ?? card;

      // Fallback — no landing target: reveal the hero + card and release.
      if (!navLogo || !cardImg) {
        gsap.set(obStage, { autoAlpha: 0, pointerEvents: "none" });
        navLogo?.classList.add("is-landed");
        if (card) gsap.set(card, { opacity: 1 });
        hero?.heroTl?.play();
        hero?.heroIdle?.();
        release();
        return;
      }

      // The flying crest — a standalone img lifted above the overlay (z 250) so
      // the rising curtain never clips it; it settles into the hero's lens card.
      const lockRect = lockup.getBoundingClientRect();
      fly = document.createElement("img");
      fly.src = MARK_SRC;
      fly.alt = "";
      fly.className = "pp-nav-fly";
      fly.setAttribute("aria-hidden", "true");
      document.body.appendChild(fly);

      gsap.set(fly, {
        left: lockRect.left,
        top: lockRect.top,
        width: lockRect.width,
        height: lockRect.height,
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(lockup, { opacity: 0 });

      // Landing target — the crest inside the hero's lens card. It eases toward
      // the card centre, shrinking to its size. (Both ends are the same hexagon,
      // so the clone dissolves into the carded mark seamlessly — no recolor.)
      const restLens = cardImg.getBoundingClientRect();
      const markCX = lockRect.left + lockRect.width / 2;
      const markCY = lockRect.top + lockRect.height / 2;
      const lensCX = restLens.left + restLens.width / 2;
      const lensCY = restLens.top + restLens.height / 2;
      const settleX = lensCX - markCX;
      const settleY = lensCY - markCY;
      const settleScale = restLens.height / lockRect.height;

      const cloudL = obStage.querySelector(".ob-cloud--left");
      const cloudTR = obStage.querySelector(".ob-cloud--top-right");
      let navShown = false;
      const onCurtain = (e: number) => {
        gsap.set(obStage, {
          clipPath: `inset(0px 0px ${(e * 100).toFixed(3)}% 0px)`,
        });
        if (cloudL)
          gsap.set(cloudL, { yPercent: -4 * e, xPercent: -2.5 * e, scale: 1 + 0.04 * e });
        if (cloudTR)
          gsap.set(cloudTR, { yPercent: -7 * e, xPercent: 3.5 * e, scale: 1 + 0.07 * e });
        if (!navShown && e >= 0.9) {
          navShown = true;
          navLogo.classList.add("is-landed");
        }
      };

      const proxy = { e: 0 };
      gsap.set(obStage, { clipPath: "inset(0px 0px 0px 0px)" });

      const CURTAIN_AT = 0.55;
      const CURTAIN_DUR = 2.0;
      const SETTLE_AT = CURTAIN_AT + CURTAIN_DUR * 0.62;
      const SETTLE_DUR = 1.1;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(obStage, { autoAlpha: 0, pointerEvents: "none" });
          release();
        },
      });
      // Beat 1 — the loader fades away.
      tl.to(divider, { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, 0);
      // Beat 2 — the curtain rises in one fluent motion; the mark holds centred.
      tl.to(
        proxy,
        {
          e: 1,
          duration: CURTAIN_DUR,
          ease: "power1.inOut",
          onUpdate: () => onCurtain(proxy.e),
        },
        CURTAIN_AT,
      );
      // Beat 3 — assemble the hero AND ease the held mark into the lens card as
      // it shrinks. Started together so the descent rides the hero.
      tl.add(() => {
        hero?.heroTl?.play();
        hero?.heroIdle?.();
      }, SETTLE_AT);
      tl.to(
        fly,
        {
          x: settleX,
          y: settleY,
          scale: settleScale,
          duration: SETTLE_DUR,
          ease: "power2.inOut",
        },
        SETTLE_AT,
      );
      // Land — fade the carded mark in and dissolve the clone into it, unseen.
      tl.add(() => {
        gsap.to(card, { opacity: 1, duration: 0.3, ease: "power1.out" });
        gsap.to(fly, { autoAlpha: 0, duration: 0.3, ease: "power1.out" });
      }, SETTLE_AT + SETTLE_DUR - 0.05);
    };

    obTl.eventCallback("onComplete", runCurtain);

    // ── Asset gate — play once fonts + key images decode (or after 1.4s). ─────
    const decode = (src: string) => {
      const img = new Image();
      img.src = src;
      return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    };
    const ready = Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      decode(MARK_SRC),
      decode("/images/clouds.webp"),
      decode("/images/grain.webp"),
      decode("/images/hero-lens.webp"),
    ]);
    let played = false;
    const play = () => {
      if (!played) {
        played = true;
        obTl.play();
      }
    };
    Promise.race([ready, new Promise((r) => setTimeout(r, 1400))]).then(play);

    // Clean up the runtime-built clone + timelines (HMR / unmount).
    return () => {
      obTl.kill();
      fly?.remove();
    };
  }, { scope: stageRef });
}
