import clsx from "clsx";
import { brand } from "@/lib/data";

/**
 * The Disha compass.
 *
 * Disha means direction, so the mark is a compass needle rather than a decorative glyph: a bezel,
 * four cardinal ticks and a two-tone needle held slightly off north, the way a real needle rests
 * once it has settled. The needle carries the accent colour so the mark reads at favicon size.
 *
 * `settle` opts the needle into the one-time settling motion defined in globals.css. The motion is
 * declared only inside a prefers-reduced-motion:no-preference block, so the resting position here
 * is the finished position and the mark is complete with no animation at all.
 */
export function CompassMark({ size = 40, settle = false, className }: { size?: number; settle?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={clsx("shrink-0", className)}
    >
      <circle cx="20" cy="20" r="17.1" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
      <g stroke="currentColor" strokeLinecap="round">
        {/* North is weighted so the mark orients itself rather than reading as a plain target. */}
        <path d="M20 0.9v4.6" strokeWidth="2.4" strokeOpacity="0.75" />
        <g strokeWidth="1.5" strokeOpacity="0.34">
          <path d="M20 34.8v3.4" />
          <path d="M1.8 20h3.4" />
          <path d="M34.8 20h3.4" />
        </g>
      </g>
      <g transform="rotate(-33 20 20)">
        <g className={settle ? "disha-needle" : undefined}>
          <path d="M20 6.4 23.1 20 16.9 20Z" fill="#D97C68" />
          <path d="M20 33.6 23.1 20 16.9 20Z" fill="currentColor" fillOpacity="0.34" />
        </g>
      </g>
      <circle cx="20" cy="20" r="1.9" fill="currentColor" />
    </svg>
  );
}

/**
 * The bilingual wordmark. Devanagari sits alongside the Latin name at matched optical weight so
 * neither script reads as a translation of the other.
 */
export function DishaWordmark({ size = "md", settle = false }: { size?: "sm" | "md" | "lg"; settle?: boolean }) {
  const scale = {
    sm: { mark: 26, latin: "text-lg", devanagari: "text-lg" },
    md: { mark: 34, latin: "text-2xl", devanagari: "text-2xl" },
    lg: { mark: 52, latin: "text-4xl sm:text-[2.75rem]", devanagari: "text-4xl sm:text-[2.75rem]" }
  }[size];

  return (
    <span className="inline-flex items-center gap-3 text-ink">
      <CompassMark size={scale.mark} settle={settle} />
      <span className="inline-flex items-baseline gap-2.5 leading-none">
        <span className={clsx("font-serif font-black tracking-tight", scale.latin)}>{brand.name}</span>
        <span className={clsx("font-devanagari font-bold text-ink/70", scale.devanagari)} lang="hi">
          दिशा
        </span>
      </span>
    </span>
  );
}
