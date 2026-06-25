"use client";

import { useRef } from "react";
import s from "./Problem.module.css";
import problem from "@/data/en/problem.json";
import { SplitText } from "@/components/shared/SplitText";
import { PpButton } from "@/components/shared/PpButton";
import { Zigzag } from "./Zigzag";
import { useProblem } from "@/lib/animations/useProblem";

export function Problem() {
  const root = useRef<HTMLElement>(null);
  useProblem(root, s);

  return (
    <section
      className={s.problem}
      aria-label="Why ambitious teams choose VexagonClouds"
      data-nav-theme="dark"
      ref={root}
    >
      <div className={s.content}>
        <p className={s.eyebrow}>
          <SplitText words={problem.eyebrow.split(" ")} />
          <span className={s.eyebrowRule} aria-hidden="true">
            <img src="/icons/problem-accent-underline.svg" alt="" />
          </span>
        </p>

        <SplitText
          as="h2"
          className={s.headline}
          words={problem.headline.split(" ")}
        />

        <SplitText
          as="p"
          className={s.body}
          words={problem.body.split(" ")}
        />

        <ul className={s.points}>
          {problem.points.map((point) => (
            <li key={point} className={s.point}>
              {point}
            </li>
          ))}
        </ul>

        <div className={s.cta}>
          <PpButton href={problem.cta.href} label={problem.cta.label} />
        </div>

        <article className={`${s.card} ${s.cardVolume}`}>
          <p className={s.cardLabel}>{problem.cards[0].label}</p>
          <p className={s.cardCopy}>{problem.cards[0].copy}</p>
          <div className={s.volumeGraphic} aria-hidden="true">
            <div className={s.graphicInner}>
              <Zigzag className={s.zigzagPath} />
            </div>
          </div>
        </article>

        <article className={`${s.card} ${s.cardFriction}`}>
          <p className={s.cardLabel}>{problem.cards[1].label}</p>
          <p className={s.cardCopy}>{problem.cards[1].copy}</p>
          <div className={s.cardGraphic} aria-hidden="true">
            <div className={s.graphicInner}>
              <Zigzag className={s.zigzagPath} />
            </div>
          </div>
        </article>

        <article className={`${s.card} ${s.cardRisk}`}>
          <p className={s.cardLabel}>{problem.cards[2].label}</p>
          <p className={s.cardCopy}>{problem.cards[2].copy}</p>
          <div className={s.cardGraphic} aria-hidden="true">
            <div className={s.graphicInner}>
              <Zigzag className={s.zigzagPath} />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
