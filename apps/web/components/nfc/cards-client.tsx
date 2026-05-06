"use client";

import { useState, useEffect } from "react";
import { useNfcCards, useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { Button } from "@/components/ui/button";
import { ensureArray } from "@/lib/utils/ensureArray";
import { NfcCard } from "@/lib/services/nfc-cards.service";
import { NfcProfileView } from "@/components/nfc/nfc-profile-view";
import { ProfileForm } from "@/components/nfc/profile-form";
import { NfcCardDialog } from "@/components/nfc/nfc-card-dialog";
import { QrCodeTooltipContent } from "@/components/nfc/qr-code-tooltip-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { Copy, MoveLeftIcon, QrCode, Nfc, IdCard, Plus } from "lucide-react";
import Link from "next/link";
import { downloadQrCode } from "@/lib/utils/qr-code";
import { toast } from "sonner";
import { CardFilters } from "@/components/nfc/card-filters";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

interface CardsClientProps {
  initialData: NfcCard[];
}

export function CardsClient({ initialData }: CardsClientProps) {
  const { data, refetch } = useNfcCards(initialData);
  const updateMutation = useUpdateNfcCard();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const isMobile = useIsMobile();

  // Reset editing state when selection changes
  useEffect(() => {
    setIsEditing(false);
  }, [selectedCardId]);

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

  return (
    <div className="flex h-full gap-6 overflow-hidden p-1">
      {/* Left Column: Card List */}
      <div className={cn(
        "transition-all duration-300 flex flex-col gap-4",
        selectedCardId && !isMobile ? "w-80" : "w-full"
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
            {cards.length === 0 ? (
              <div className="col-span-full py-20">
                <Empty>
                  <EmptyMedia variant="icon">
                    <IdCard className="size-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No NFC cards found</EmptyTitle>
                    <EmptyDescription>
                      Start by creating your first NFC card for your organization.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <NfcCardDialog
                      onSuccess={refetch}
                      trigger={
                        <Button>
                          <Plus className="size-3.5 mr-1.5" />
                          New card
                        </Button>
                      }
                    />
                  </EmptyContent>
                </Empty>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="col-span-full py-12">
                <Empty>
                  <EmptyMedia variant="icon">
                    <IdCard className="size-5" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No matching cards</EmptyTitle>
                    <EmptyDescription>
                      We couldn't find any cards matching your current filters.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            ) : (
              filteredCards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "relative group border p-4 flex flex-col gap-3 transition-all duration-200 overflow-hidden rounded-none",
                    selectedCardId === card.id
                      ? "border-foreground bg-foreground/5 shadow-md"
                      : "bg-background hover:bg-muted/30 border-border hover:border-foreground/20 shadow-sm"
                  )}
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
                      <Tooltip>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        <TooltipContent>Copy URL</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-none border border-border hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                const qrUrl = new URL(card.encodedUrl);
                                qrUrl.searchParams.set("ref", "qr");
                                downloadQrCode(qrUrl.toString(), `card-${card.id}-qr.png`);
                                toast.success("QR Code downloaded!");
                              } catch (err) {
                                console.error("Invalid URL", err);
                                toast.error("Failed to generate QR Code");
                              }
                            }}
                          >
                            <QrCode size={12} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="p-2 border-border shadow-lg">
                          <QrCodeTooltipContent url={card.encodedUrl} />
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hardware ID</span>
                    <span className="text-[11px] font-mono text-muted-foreground font-bold">{card.hardwareId || "N/A"}</span>
                  </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="w-full rounded-none font-bold uppercase text-[10px]"
                        variant={card.profile ? "outline" : "default"}
                        onClick={() => setSelectedCardId(card.id)}
                      >
                        {card.profile ? "View Details" : "Create Profile"}
                      </Button>

                      {!card.hardwareId && card.profile && card.cardType === "CUSTOMER_OWNED" && (
                        <Button
                          asChild
                          size="sm"
                          variant="default"
                          className="w-full rounded-none font-bold uppercase text-[10px]"
                        >
                          <Link
                            href={`/activate?url=${encodeURIComponent(card.encodedUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Nfc className="mr-2 size-3" />
                            Activate Card
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Detail Panel: Same z-index, no overlay */}
      {selectedCardId && selectedCard && (() => {
        const content = (
          <>
            <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background sticky top-0 z-20 rounded-none">
              <div className="flex items-start sm:items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCardId(null)}
                  className="rounded-none hover:bg-muted shrink-0"
                >
                  <MoveLeftIcon size={20} />
                </Button>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-black text-lg tracking-tight uppercase truncate">Card Details</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-none border border-border truncate max-w-[120px] sm:max-w-none">{selectedCard.id}</span>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-tighter rounded-none border-border shrink-0">
                      {selectedCard.cardType}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 w-full sm:w-auto shrink-0 pl-14 sm:pl-0">
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
              <div className="p-4 sm:p-8 pb-16">
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
                      <div className="bg-background rounded-none border-border p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-inner">
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
                            onSuccess={() => {
                              setIsEditing(false);
                              refetch();
                            }}
                            onCancel={selectedCard.profile ? () => setIsEditing(false) : undefined}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        );

        if (isMobile) {
          return (
            <Sheet open={true} onOpenChange={(open) => !open && setSelectedCardId(null)}>
              <SheetContent className="w-[95vw] p-0 flex flex-col h-full sm:max-w-md [&>button]:hidden border-l" side="right">
                <SheetTitle className="sr-only">Card Details</SheetTitle>
                <SheetDescription className="sr-only">NFC Card Details and Profile Configuration</SheetDescription>
                <div className="flex-1 bg-muted/5 flex flex-col h-full overflow-hidden relative">
                  {content}
                </div>
              </SheetContent>
            </Sheet>
          );
        }

        return (
          <div className="flex-1 border bg-muted/5 flex flex-col animate-in slide-in-from-right duration-300 border-border overflow-hidden h-full rounded-none">
            {content}
          </div>
        );
      })()}
    </div>
  );
}
