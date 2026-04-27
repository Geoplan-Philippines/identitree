"use client";

import { useState, useEffect } from "react";
import { useNfcCards, useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { Button } from "@/components/ui/button";
import { ensureArray } from "@/lib/utils/ensureArray";
import { Skeleton } from "@/components/ui/skeleton";
import { NfcCard } from "@/lib/services/nfc-cards.service";
import { NfcProfileView } from "@/components/nfc/nfc-profile-view";
import { ProfileForm } from "@/components/nfc/profile-form";
import { NfcCardDialog } from "@/components/nfc/nfc-card-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Copy, MoveLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { CardFilters } from "@/components/nfc/card-filters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CardsPage() {
  const { data, isLoading, error, refetch } = useNfcCards();
  const updateMutation = useUpdateNfcCard();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Reset editing state when selection changes
  useEffect(() => {
    setIsEditing(false);
  }, [selectedCardId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-none" />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-red-500">Failed to load cards.</p>;

  const cards = ensureArray(data) as NfcCard[];

  const filteredCards = cards.filter((card) => {
    const matchesSearch = 
      card.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.hardwareId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.cardType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || card.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedCard = cards.find((c) => c.id === selectedCardId) || null;

  if (cards.length === 0) {
    return <p className="text-muted-foreground">No NFC cards found.</p>;
  }

  return (
    <div className="flex h-full gap-6 overflow-hidden p-1">
      {/* Left Column: Card List */}
      <div className={cn(
        "transition-all duration-300 flex flex-col gap-4",
        selectedCardId ? "w-80" : "w-full"
      )}>
        <CardFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          count={filteredCards.length}
        />

        <ScrollArea className="flex-1 pr-4 min-h-0">
          <div className={cn(
            "grid gap-5 pb-16",
            selectedCardId ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {filteredCards.length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-muted rounded-none">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No matching cards</p>
              </div>
            ) : (
              filteredCards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  "relative group border p-6 flex flex-col gap-4 transition-all duration-200 cursor-pointer overflow-hidden rounded-none",
                  selectedCardId === card.id
                    ? "border-foreground bg-foreground/5 shadow-md"
                    : "bg-background hover:bg-muted/30 border-border hover:border-foreground/20 shadow-sm"
                )}
                onClick={() => setSelectedCardId(card.id)}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Card Type</span>
                    <span className="font-bold text-sm uppercase">{card.cardType.replace("_", " ")}</span>
                  </div>
                  <Badge
                    variant={card.profile ? "default" : "secondary"}
                    className="text-[9px] h-4 rounded-none px-1.5 uppercase font-bold"
                  >
                    {card.profile ? "ASSIGNED" : card.status}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Profile</span>
                  <span className="font-extrabold text-lg tracking-tight uppercase">
                    {card.profile ? `${card.profile.firstName} ${card.profile.lastName}` : "Unassigned"}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 relative z-10 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Encoded URL</span>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={card.encodedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-foreground font-medium truncate font-mono bg-muted px-2 py-1 border border-border flex-1 hover:bg-muted/80 transition-colors cursor-alias"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {card.encodedUrl}
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-none border border-border hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(card.encodedUrl);
                        toast.success("URL copied to clipboard!");
                      }}
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hardware ID</span>
                  <span className="text-[11px] font-mono text-muted-foreground font-bold">{card.hardwareId || "N/A"}</span>
                </div>
              </div>
            )))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Detail Panel: Same z-index, no overlay */}
      {selectedCardId && selectedCard && (
        <div className="flex-1 border bg-muted/5 flex flex-col animate-in slide-in-from-right duration-300 border-border overflow-hidden h-full rounded-none">
          <div className="p-5 border-b flex items-center justify-between bg-background sticky top-0 z-20 rounded-none">
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCardId(null)}
                className="rounded-none hover:bg-muted"
              >
                <MoveLeftIcon size={20} />
              </Button>
              <div className="space-y-0.5">
                <h3 className="font-black text-lg tracking-tight uppercase">Card Details</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-none border border-border">{selectedCard.id}</span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter rounded-none border-border">
                    {selectedCard.cardType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5">
              <NfcCardDialog
                initialData={selectedCard}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                trigger={
                  <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                    Edit Card
                  </Button>
                }
                onSuccess={refetch}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={selectedCard.status === "ACTIVE" ? "destructive" : "default"}
                    size="sm"
                    disabled={selectedCard.status === "UNASSIGNED" || updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Updating..." : (selectedCard.status === "ACTIVE" ? "Deactivate" : "Activate")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-lg">
                      {selectedCard.status === "ACTIVE" ? "Deactivate Card?" : "Activate Card?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-medium text-slate-600">
                      {selectedCard.status === "ACTIVE"
                        ? "This will hide your profile from the public. You can reactivate it anytime."
                        : "This will make your profile visible to anyone who scans your card."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-none border border-black font-bold uppercase">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        "rounded-none font-bold uppercase",
                        selectedCard.status === "ACTIVE" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
                      )}
                      onClick={async () => {
                        const newStatus = selectedCard.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                        await updateMutation.mutateAsync({ id: selectedCard.id, payload: { status: newStatus as any } });
                        toast.success(`Card ${newStatus.toLowerCase()}d!`);
                        refetch();
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <ScrollArea className="flex-1 w-full min-h-0">
            <div className="p-8 pb-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 px-2">
                    <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Connected Profile</h3>
                  </div>

                  {selectedCard.profile && !isEditing ? (
                    <div className="bg-background rounded-none overflow-hidden">
                      <NfcProfileView
                        profile={selectedCard.profile}
                        cardId={selectedCard.id}
                        onEdit={() => setIsEditing(true)}
                      />
                    </div>
                  ) : (
                    <div className="bg-background rounded-none border-border p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-inner">
                      {!isEditing && (
                        <div className="space-y-4">
                          <h4 className="text-2xl font-black tracking-tight uppercase">Empty Profile</h4>
                          <p className="text-sm text-muted-foreground max-w-[320px] mx-auto leading-relaxed font-medium">This card is ready for a digital identity. Create a profile below to activate it.</p>
                        </div>
                      )}
                      <div className={cn("w-full pt-12", !isEditing && "border-t border-foreground/5")}>
                        <ProfileForm
                          cardId={selectedCard.id}
                          initialData={selectedCard.profile}
                          onSuccess={() => setIsEditing(false)}
                          onCancel={selectedCard.profile ? () => setIsEditing(false) : undefined}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
