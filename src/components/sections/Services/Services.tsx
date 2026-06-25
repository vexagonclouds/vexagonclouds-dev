"use client";

import { useRef, type ReactNode } from "react";
import s from "./Services.module.css";
import services from "@/data/en/services.json";
import profiles from "@/data/en/profiles.json";
import { SplitText, type SplitWord } from "@/components/shared/SplitText";
import { useServices } from "@/lib/animations/useServices";

// Capability icons — same set used on the home capabilities deck.
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

// Services — the dedicated /services page header + a detailed grid of the
// capabilities (single source of truth: the 5 cards in profiles.json). Built in
// A's visual language with the fluid tokens; first section on the page, so it
// carries the top padding that clears the fixed navbar.
export function Services() {
  const root = useRef<HTMLElement>(null);
  useServices(root, s);

  const titleWords: SplitWord[] = [
    ...services.title.lead,
    ...services.title.accent.map((t) => ({ text: t, className: s.accent })),
  ];

  return (
    <section
      className={s.services}
      id="services"
      aria-label="Our services"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.inner}>
        <header className={s.head}>
          <span className={s.kicker}>{services.kicker}</span>
          <SplitText as="h1" className={s.title} words={titleWords} />
          <p className={s.sub}>{services.sub}</p>
        </header>

        <div className={s.grid}>
          {profiles.cards.map((c) => (
            <article className={s.card} key={c.id}>
              <span className={s.icon} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[c.icon]}
                </svg>
              </span>
              <h2 className={s.name}>{c.name}</h2>
              <p className={s.desc}>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
