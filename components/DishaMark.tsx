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
      {/* Double bezel: a weighted outer ring with a fine inner ring, so the mark reads as an
          instrument rather than a circle with a pointer in it. */}
      <circle cx="20" cy="20" r="17.4" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.9" />
      <circle cx="20" cy="20" r="13.4" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
      <g stroke="currentColor" strokeLinecap="round">
        {/* North is weighted so the mark orients itself rather than reading as a plain target. */}
        <path d="M20 2.6v4.3" strokeWidth="2.6" strokeOpacity="0.95" />
        <g strokeWidth="1.5" strokeOpacity="0.4">
          <path d="M20 33.1v4.3" />
          <path d="M2.6 20h4.3" />
          <path d="M33.1 20h4.3" />
        </g>
      </g>
      <g transform="rotate(-38 20 20)">
        <g className={settle ? "disha-needle" : undefined}>
          {/* A slim kite rather than a stick: the lit half carries the accent, the trailing half
              is the counterweight, and the waist keeps both halves legible at favicon size. */}
          <path d="M20 5.6 24 19.1 20 21.2 16 19.1Z" fill="#D97C68" />
          <path d="M20 34.4 24 20.9 20 18.8 16 20.9Z" fill="currentColor" fillOpacity="0.42" />
        </g>
      </g>
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      <circle cx="20" cy="20" r="1" fill="#FBF7F1" />
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
