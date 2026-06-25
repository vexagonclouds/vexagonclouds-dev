"use client";

import { useRef } from "react";
import s from "./Testimonials.module.css";
import data from "@/data/en/testimonials.json";
import { SplitText, type SplitWord } from "@/components/shared/SplitText";
import { useTestimonials } from "@/lib/animations/useTestimonials";

// Testimonials — net-new section (Website B's 6 client quotes). Native
// scroll-snap track driven by prev/next buttons (accessible, no transform math);
// reduced motion just jumps instead of smooth-scrolling. Built in A's style.
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useTestimonials(root, s);

  const titleWords: SplitWord[] = [
    ...data.title.lead,
    ...data.title.accent.map((t) => ({ text: t, className: s.accent })),
  ];

  const step = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.${s.card}`);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    const dist = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * dist, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      className={s.section}
      aria-label="Client testimonials"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.inner}>
        <header className={s.head}>
          <span className={s.kicker}>{data.kicker}</span>
          <SplitText as="h2" className={s.title} words={titleWords} />
          <p className={s.sub}>{data.sub}</p>
        </header>

        <div className={s.carousel}>
          <button
            type="button"
            className={`${s.nav} ${s.prev}`}
            aria-label="Previous testimonial"
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={s.track} ref={trackRef}>
            {data.items.map((t) => (
              <article className={s.card} key={t.name}>
                <div className={s.stars} aria-label="5 out of 5 stars">★★★★★</div>
                <p className={s.quote}>{t.quote}</p>
                <div className={s.author}>
                  <span className={s.avatar} aria-hidden="true">{t.initials}</span>
                  <div>
                    <div className={s.name}>{t.name}</div>
                    <div className={s.role}>{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className={`${s.nav} ${s.next}`}
            aria-label="Next testimonial"
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
