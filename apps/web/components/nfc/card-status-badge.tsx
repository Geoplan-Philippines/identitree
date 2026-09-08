import { cn } from "@/lib/utils";
import type { NfcCard } from "@/lib/services/nfc-cards.service";

type CardStatus = NfcCard["status"];

/**
 * Status is the source of truth for a card's lifecycle. It is intentionally
 * kept in its own visual language (neutral chip + colored square indicator)
 * so it never reads as an action — brass is reserved for buttons only.
 */
const STATUS_META: Record<CardStatus, { label: string; dot: string; text: string }> = {
  ACTIVE: { label: "Active", dot: "bg-emerald-500", text: "text-foreground" },
  INACTIVE: { label: "Inactive", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  UNASSIGNED: {
    label: "Unassigned",
    dot: "border border-muted-foreground/70",
    text: "text-muted-foreground",
  },
  UNACTIVATED: {
    label: "Unactivated",
    dot: "border border-muted-foreground/70",
    text: "text-muted-foreground",
  },
  LOST: { label: "Lost", dot: "bg-destructive", text: "text-destructive" },
  REPLACED: { label: "Replaced", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

export function CardStatusBadge({
  status,
  className,
}: {
  status: CardStatus;
  className?: string;
}) {
  const meta = STATUS_META[status] ?? STATUS_META.INACTIVE;

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2 text-[9px] font-bold uppercase tracking-wide",
        meta.text,
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
