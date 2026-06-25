import s from "./Hero.module.css";

type Chip = { t: string; due?: boolean };
export type Doc = { cat: string; title: string; sub: string; chips: Chip[] };

// lucide "file" icon (stroke = currentColor).
function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function DocRow({ doc }: { doc: Doc }) {
  return (
    <article className={s.docRow}>
      <span className={s.docRowIcon}>
        <FileIcon />
      </span>
      <span className={s.docRowMain}>
        <span className={s.docRowHead}>
          <span className={s.docRowTitle}>{doc.title}</span>
          <span className={s.docRowCat}>{doc.cat}</span>
        </span>
        <span className={s.docRowSub}>{doc.sub}</span>
        <span className={s.docRowChips}>
          {doc.chips.map((c, i) => (
            <span
              key={i}
              className={`${s.docRowChip}${c.due ? ` ${s.docRowChipDue}` : ""}`}
            >
              {c.t}
            </span>
          ))}
        </span>
      </span>
    </article>
  );
}

// A single marquee track of readable document rows, doubled so the loop is
// seamless. (Previously a skeleton layer was masked over the left half to tell a
// "loading → loaded" story; now both sides show loaded documents.)
export function Conveyor({ documents }: { documents: Doc[] }) {
  const doubled = [...documents, ...documents];
  return (
    <div className={s.conveyor} aria-hidden="true">
      <div className={s.layer}>
        <div className={s.track}>
          {doubled.map((doc, i) => (
            <DocRow key={i} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}
