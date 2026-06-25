type PpMarkProps = {
  className?: string;
  // When provided, the mark is exposed as an image with this accessible name;
  // otherwise it is decorative (its wrapping link/element carries the label).
  label?: string;
};

// VexagonClouds hexagon crest. Kept as an <svg> wrapper embedding the PNG via
// <image> so every host's existing `svg` sizing rule keeps working unchanged
// (the old per-theme stem/blade fill rules are now inert — the crest is a fixed
// gold raster). Square viewBox; <image> defaults to xMidYMid meet so it never
// distorts regardless of the box the host sizes it to.
export function PpMark({ className, label }: PpMarkProps) {
  const a11y = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true as const };
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // The crest is square where the old P-mark was tall, so a height-driven host
      // box would compute a wider svg and overflow narrow slots. Clamp to the host
      // box (contain) without touching any consumer's sizing rules.
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      {...a11y}
    >
      <image href="/icons/vx-mark.png" x="0" y="0" width="512" height="512" />
    </svg>
  );
}
