"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Link as LinkIcon, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

export function ActivateClient() {
  const [targetUrl, setTargetUrl] = useState("");
  const [step, setStep] = useState<"input" | "scanning" | "success">("input");
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [hardwareId, setHardwareId] = useState<string | null>(null);

  const handleStartLinking = async () => {
    if (!targetUrl) return;

    if (!("NDEFReader" in window)) {
      toast.error("Web NFC is not supported on this browser.");
      return;
    }

    try {
      setStep("scanning");
      setIsScanning(true);
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: any) => {
        try {
          const serialNumber = event.serialNumber;
          setHardwareId(serialNumber);
          
          setIsScanning(false);
          setIsWriting(true);

          // Register the card
          await apiClient.post("/nfc-cards/public-register-customer", {
            encodedUrl: targetUrl,
            hardwareId: serialNumber,
          });

          // Prepare the URL to write (always include ref=nfc_tap)
          let finalUrl = targetUrl;
          try {
            const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `${window.location.origin}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`);
            urlObj.searchParams.set("ref", "nfc_tap");
            finalUrl = urlObj.toString();
          } catch (e) {
            console.error("Invalid URL format:", e);
          }

          // Write to the physical card
          await ndef.write({
            records: [{ recordType: "url", data: finalUrl }]
          });

          setIsWriting(false);
          setStep("success");
          toast.success("Card linked successfully!");
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Failed to complete process");
          setIsWriting(false);
          setIsScanning(false);
          setStep("input");
        }
      };

      ndef.onreadingerror = () => {
        toast.error("Tap failed. Try again.");
        setIsScanning(false);
        setStep("input");
      };

    } catch (err: any) {
      toast.error(err.message || "Failed to start NFC");
      setIsScanning(false);
      setStep("input");
    }
  };

  const handleReset = () => {
    setTargetUrl("");
    setStep("input");
    setHardwareId(null);
  };

  return (
    <main className="main-container py-12 md:py-20 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Activate Your NFC Card
          </h1>
          <p className="text-sm text-muted-foreground">
            Register your personal card to your profile.
          </p>
        </div>

        <Card className="border border-border bg-background shadow-sm rounded-none overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/20 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-foreground text-background p-2 rounded-none">
                <CreditCard className="size-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">
                  {step === "input" ? "Step 1: Link" : step === "scanning" ? "Step 2: Tap" : "Complete"}
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  NFC Registration
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {step === "input" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Profile URL
                  </Label>
                  <Input
                    id="url"
                    placeholder="https://identitree.geoplan.ph/org/slug"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="rounded-none border-border bg-muted/10 h-12"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium italic">
                    Paste the URL from your profile page here.
                  </p>
                </div>
                <Button
                  onClick={handleStartLinking}
                  disabled={!targetUrl}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none font-bold uppercase tracking-widest text-[10px]"
                >
                  Link & Proceed to Tap
                </Button>
              </div>
            )}

            {step === "scanning" && (
              <div className="flex flex-col items-center justify-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-foreground/5 animate-ping rounded-full" />
                  <div className="relative bg-muted border border-border p-8 rounded-none">
                    <Smartphone className={cn("size-10 transition-transform", isScanning && "animate-bounce")} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {isWriting ? "Writing to Card" : "Ready to Tap"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                    {isWriting
                      ? "Finalizing the activation. Please hold your card steady."
                      : "Touch the physical card to the back of your phone."}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                  <Loader2 className="size-3 animate-spin" />
                  Communication Active
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-foreground text-background p-5 rounded-none border border-foreground">
                  <CheckCircle2 className="size-10" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-foreground tracking-tight">Activated Successfully</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your physical card is now linked and fully encoded.
                  </p>
                  {hardwareId && (
                    <div className="mt-4 p-3 bg-muted border border-border text-left">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">ID</p>
                      <code className="text-[10px] font-mono text-foreground break-all">{hardwareId}</code>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                   <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full h-11 rounded-none border-border font-bold uppercase tracking-widest text-[10px] hover:bg-muted"
                  >
                    Activate Another Card
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 text-center leading-loose">
          Secure Registration • Identitree NFC
        </p>
      </div>
    </main>
  );
}
