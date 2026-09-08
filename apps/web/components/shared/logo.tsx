import Image from "next/image";
import { cn } from "@/lib/utils";

// Static imports so Next emits content-hashed filenames — replacing a mark
// (even under the same name) changes the hash and busts every cache.
import raisedMark from "@/public/assets/wing-mark-on-folio-raised.png";
import folioMark from "@/public/assets/wing-mark-on-folio.png";
import inkMark from "@/public/assets/wing-mark-on-ink.png";
import giltMark from "@/public/assets/wing-mark-on-gilt.png";

/**
 * The Handshakes wing mark — "Two arcs. One meeting point."
 * Four background-tuned variants of the real brand mark:
 *   raised → forest + brass  (primary, for light/paper surfaces)
 *   folio  → forest + sage   (muted, for light surfaces)
 *   ink    → cream + brass   (for dark forest surfaces)
 *   gilt   → forest + cream  (for brass surfaces)
 */
const MARKS = {
  raised: raisedMark,
  folio: folioMark,
  ink: inkMark,
  gilt: giltMark,
} as const;

export type MarkVariant = keyof typeof MARKS;

export function WingMark({
  variant = "raised",
  className,
  priority = false,
  label,
}: {
  variant?: MarkVariant;
  className?: string;
  priority?: boolean;
  /** Provide when the mark stands alone; omit inside a lockup that already has the word. */
  label?: string;
}) {
  return (
    <Image
      src={MARKS[variant]}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      priority={priority}
      className={cn("h-auto w-16 select-none", className)}
    />
  );
}

/**
 * Horizontal lockup: wing mark + wordmark. The brand's primary signature.
 * Wordmark is lowercase Poppins and inherits `currentColor`, so set the text
 * color on a parent and pass the matching mark `variant`.
 */
export function Logo({
  variant = "raised",
  className,
  markClassName,
  wordClassName,
  showWord = true,
  priority = false,
  label = "Handshakes",
}: {
  variant?: MarkVariant;
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  showWord?: boolean;
  priority?: boolean;
  label?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <WingMark
        variant={variant}
        priority={priority}
        label={showWord ? undefined : label}
        className={cn("w-8", markClassName)}
      />
      {showWord && (
        <span
          className={cn(
            "font-display text-[16px] font-semibold lowercase leading-none tracking-tight",
            wordClassName,
          )}
        >
          handshakes
        </span>
      )}
    </span>
  );
}
