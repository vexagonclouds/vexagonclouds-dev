"use client";

import { useRef, type ReactNode } from "react";
import s from "./Profiles.module.css";
import profiles from "@/data/en/profiles.json";
import { SplitText, type SplitWord } from "@/components/shared/SplitText";
import { useProfiles } from "@/lib/animations/useProfiles";

// Capability icons — copied verbatim from Website B's service cards
// (reference-b/index.html). Stroke glyphs on a 0 0 24 24 viewBox.
const ICONS: Record<string, ReactNode> = {
  cloud: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  sparkle: (
    <>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    </>
  ),
  chart: (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
};

type DeckCard = {
  id: string;
  num: string;
  kind: "cap" | "cta";
  icon?: string;
  name: string;
  desc: string;
  href?: string;
  label?: string;
};

// Profiles — Website B's capabilities as A's signature fanned 3D flip-deck,
// re-choreographed for 6 cards. The 5 services + the CTA become 6 flip cards
// that fan centre-stage (front faces), then spread + flip into a 3×2 grid
// (back faces with name/desc, and the CTA on card 06) as the section is pinned.
// CSS base = the resolved back-spread, so no-JS / reduced motion / mobile land
// on the readable grid.
export function Profiles() {
  const root = useRef<HTMLElement>(null);
  useProfiles(root, s);

  const titleWords: SplitWord[] = [
    ...profiles.title.lead,
    ...profiles.title.accent.map((t) => ({ text: t, className: s.accent })),
  ];

  const deck: DeckCard[] = [
    ...profiles.cards.map((c, i) => ({
      id: String(i + 1).padStart(2, "0"),
      num: String(i + 1).padStart(2, "0"),
      kind: "cap" as const,
      icon: c.icon,
      name: c.name,
      desc: c.desc,
    })),
    {
      id: "06",
      num: "06",
      kind: "cta" as const,
      name: profiles.cta.title,
      desc: profiles.cta.text,
      href: profiles.cta.href,
      label: profiles.cta.label,
    },
  ];

  return (
    <section
      className={s.profiles}
      id="services"
      aria-label="Our capabilities"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.inner}>
        <header className={s.head}>
          <span className={s.kicker}>{profiles.kicker}</span>
          <SplitText as="h2" className={s.title} words={titleWords} />
          <p className={s.sub}>{profiles.sub}</p>
        </header>

        <div className={s.deck}>
          {deck.map((card) => (
            <article
              key={card.id}
              className={`${s.card}${card.kind === "cta" ? ` ${s.cardCta}` : ""}`}
              data-profile={card.id}
            >
              <div className={s.cardPos}>
                <div className={s.cardFlip}>
                  {/* Front face — the fanned "cover": icon + giant number. */}
                  <div className={s.cardFace}>
                    {card.kind === "cap" && (
                      <span className={s.cardIcon} aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {ICONS[card.icon as string]}
                        </svg>
                      </span>
                    )}
                    <span className={s.cardNum}>{card.num}</span>
                  </div>

                  {/* Back face — revealed after the flip. The CTA card (06) is a
                      whole-card link to the services page. */}
                  <div className={`${s.cardFace} ${s.cardFaceBack}`}>
                    {card.kind === "cta" ? (
                      <a className={s.cardCtaLink} href={card.href}>
                        <span className={s.cardNum}>{card.num}</span>
                        <div className={s.cardMeta}>
                          <span className={s.cardName}>{card.name}</span>
                          <span className={s.cardDesc}>{card.desc}</span>
                          <span className={s.cardLink}>
                            {card.label}
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </a>
                    ) : (
                      <>
                        <span className={s.cardNum}>{card.num}</span>
                        <div className={s.cardMeta}>
                          <span className={s.cardName}>{card.name}</span>
                          <span className={s.cardDesc}>{card.desc}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
