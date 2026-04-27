"use client";

import { useNfcCards } from "@/hooks/use-nfc-cards";
import { Button } from "@/components/ui/button";
import { ensureArray } from "@/lib/utils/ensureArray";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardsPage() {
  const { data, isLoading, error } = useNfcCards();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-red-500">Failed to load cards.</p>;

  const cards = ensureArray(data);
  if (cards.length === 0) {
    return <p className="text-muted-foreground">No NFC cards found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        if (
          typeof card !== "object" ||
          card === null ||
          typeof (card as any).id !== "string" ||
          typeof (card as any).cardType !== "string" ||
          typeof (card as any).encodedUrl !== "string"
        ) {
          return null;
        }
        return (
          <div key={(card as any).id} className="rounded-lg border bg-background p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Card Type</span>
              <span className="font-semibold text-foreground">{(card as any).cardType.replace("_", " ")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Encoded URL</span>
              <span className="break-all text-sm text-blue-700 underline underline-offset-2">{(card as any).encodedUrl}</span>
            </div>
            {(card as any).hardwareId && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Hardware ID</span>
                <span className="text-sm">{(card as any).hardwareId}</span>
              </div>
            )}
            <div className="flex flex-row justify-end mt-2">
              <Button size="sm" variant="outline">View details</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
