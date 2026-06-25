"use client";

import { useRef } from "react";
import s from "./Cases.module.css";
import cases from "@/data/en/cases.json";
import { SplitText, type SplitWord } from "@/components/shared/SplitText";
import { PpButton } from "@/components/shared/PpButton";
import { useCases } from "@/lib/animations/useCases";

// Cases / portfolio — net-new section (Website B's 8 case studies). No A
// counterpart existed, so it's built in A's visual language using the fluid
// tokens (--pp-fs-*, --pp-gutter, --pp-stack) rather than the 1512 artboard
// scale, so it reflows cleanly. Anchor id="portfolio" matches the Method +
// Profiles CTAs that point at it.
//
// Props: `limit` caps how many cases render (home shows 3); `moreHref` adds a
// "View more" pill below the grid linking to the full list. /portfolio passes
// neither, so it renders all cases with no button.
export function Cases({
  limit,
  moreHref,
}: {
  limit?: number;
  moreHref?: string;
} = {}) {
  const root = useRef<HTMLElement>(null);
  useCases(root, s);

  const titleWords: SplitWord[] = [
    ...cases.title.lead,
    ...cases.title.accent.map((t) => ({ text: t, className: s.accent })),
  ];

  const shown =
    typeof limit === "number" ? cases.cases.slice(0, limit) : cases.cases;

  return (
    <section
      className={s.cases}
      id="portfolio"
      aria-label="Case studies"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.inner}>
        <header className={s.head}>
          <span className={s.kicker}>{cases.kicker}</span>
          <SplitText as="h2" className={s.title} words={titleWords} />
          <p className={s.sub}>{cases.sub}</p>
        </header>

        <div className={s.grid}>
          {shown.map((c) => (
            <article className={s.card} key={c.id}>
              <span className={s.chip}>{c.category}</span>

              <h3 className={s.blockTitle}>{cases.labels.challenge}</h3>
              <p className={s.text}>{c.challenge}</p>

              <h3 className={s.blockTitle}>{cases.labels.solution}</h3>
              <p className={s.text}>{c.solution}</p>

              <div className={s.results}>
                <h4 className={s.resultsTitle}>{cases.labels.results}</h4>
                <ul className={s.bullets}>
                  {c.results.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className={s.tags}>
                {c.tags.map((t) => (
                  <span className={s.tag} key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {moreHref && (
          <div className={s.more}>
            <PpButton href={moreHref} label={cases.more} />
          </div>
        )}
      </div>
    </section>
  );
}
