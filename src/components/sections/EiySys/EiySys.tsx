"use client";

import { useRef } from "react";
import s from "./EiySys.module.css";
import eiysys from "@/data/en/eiysys.json";
import { SplitText, type SplitWord } from "@/components/shared/SplitText";
import { useEiySys } from "@/lib/animations/useEiySys";

// EiySys — extended services delivered in partnership with EIY SYS, shown below
// the core capabilities on /services. Header + a responsive grid of 6 service
// cards (name + description, no icons in the source). Built in A's visual
// language with the fluid tokens; mirrors Cases/Services.
export function EiySys() {
  const root = useRef<HTMLElement>(null);
  useEiySys(root, s);

  const titleWords: SplitWord[] = [
    ...eiysys.title.lead,
    ...eiysys.title.accent.map((t) => ({ text: t, className: s.accent })),
  ];

  return (
    <section
      className={s.eiysys}
      aria-label="Powered by EIY SYS"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.inner}>
        <header className={s.head}>
          <span className={s.kicker}>{eiysys.kicker}</span>
          <SplitText as="h2" className={s.title} words={titleWords} />
          <p className={s.sub}>{eiysys.sub}</p>
        </header>

        <div className={s.grid}>
          {eiysys.services.map((svc) => (
            <article className={s.card} key={svc.id}>
              <h3 className={s.name}>{svc.name}</h3>
              <p className={s.desc}>{svc.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
