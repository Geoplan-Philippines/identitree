"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CheckCircle2, Loader2, CreditCard, AlertTriangle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { checkNfcCardExists, registerCustomerCard } from "@/lib/services/nfc-cards.service";

const faqs = [
  {
    q: "Does this work on any browser?",
    a: "No. Web NFC is currently only supported on Chrome for Android. iOS and desktop browsers are not supported at this time.",
  },
  {
    q: "What kind of phone do I need?",
    a: "You need an Android phone with NFC hardware enabled. Most modern Android devices support NFC — you can check in your phone's Settings under 'Connected devices' or 'NFC'.",
  },
  {
    q: "Where do I find my profile URL?",
    a: "Visit your Identitree profile page and copy the URL from the browser address bar. It should look like: https://identitree.geoplan.ph/your-org/your-name",
  },
  {
    q: "Can I activate the same card twice?",
    a: "Yes. If you activate a card that's already been linked, the hardware ID will be updated and the URL will be re-written to the chip.",
  },
  {
    q: "What if the tap fails?",
    a: "Hold your phone steady with the NFC card flat against the back. Try removing your phone case if needed. NFC antennas are usually located near the center or top of the phone.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
      >
        {q}
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export function ActivateClient() {
  const [targetUrl, setTargetUrl] = useState("");
  const [step, setStep] = useState<"input" | "scanning" | "success">("input");
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [hardwareId, setHardwareId] = useState<string | null>(null);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);

  // Pre-calculated URL to write (to ensure the fastest possible write)
  const finalUrlRef = useRef<string>("");
  const normalizedUrlRef = useRef<string>("");
  const isUrlRegisteredRef = useRef<boolean>(false);
  const readyToProcess = useRef(false);

  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");

  useEffect(() => {
    if (urlParam) {
      setTargetUrl(urlParam);
    }
  }, [urlParam]);

  const handleStartLinking = async () => {
    if (!targetUrl) return;

    if (!("NDEFReader" in window)) {
      toast.error("Web NFC is not supported on this browser.");
      return;
    }

    try {
      setStep("input"); // Stay on input while checking
      setIsCheckingUrl(true);
      
      // 1. NORMALIZE URL
      let normalized = targetUrl;
      try {
        const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `${window.location.origin}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`);
        normalized = urlObj.toString();
      } catch (e) {
        console.warn("URL normalization failed:", e);
      }
      normalizedUrlRef.current = normalized;

      // 2. CHECK DATABASE & PREPARE FINAL URL
      let finalUrl = normalized;
      try {
        const res = await checkNfcCardExists(normalized);
        isUrlRegisteredRef.current = !!res.exists;
        
        if (res.exists) {
          const urlObj = new URL(normalized);
          urlObj.searchParams.set("ref", "nfc_tap");
          finalUrl = urlObj.toString();
        }
      } catch (err) {
        console.warn("Database check failed, assuming non-registered", err);
        isUrlRegisteredRef.current = false;
      }

      finalUrlRef.current = finalUrl;
      setIsCheckingUrl(false);

      // 3. START NFC SESSION
      setStep("scanning");
      setIsScanning(true);
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      readyToProcess.current = true;

      ndef.onreading = async (event: any) => {
        if (!readyToProcess.current) return;
        readyToProcess.current = false;

        try {
          const serialNumber = event.serialNumber;
          setHardwareId(serialNumber);
          
          setIsScanning(false);
          setIsWriting(true);

          // 4. WRITE IMMEDIATELY (Pre-prepared URL)
          await ndef.write({
            records: [{ recordType: "url", data: finalUrlRef.current }]
          });

          // 5. Finalize registration in background
          if (isUrlRegisteredRef.current) {
            registerCustomerCard({
              encodedUrl: normalizedUrlRef.current,
              hardwareId: serialNumber,
            }).catch(apiErr => {
              console.warn("Background registration failed:", apiErr);
            });
          }

          setIsWriting(false);
          setStep("success");
          toast.success(isUrlRegisteredRef.current ? "Card linked successfully!" : "Card encoded successfully!");
        } catch (err: any) {
          console.error("NFC Write Error:", err);
          toast.error(`Write failed: ${err.message || "Unknown error"}`);
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

        {/* NFC Requirement Warning */}
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 rounded-none">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">NFC-enabled Android phone required</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-500 leading-relaxed">
              This tool requires <span className="font-bold">Chrome on Android</span> with NFC enabled. iOS and desktop browsers are not supported.
            </p>
          </div>
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
                  disabled={!targetUrl || isCheckingUrl}
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none font-bold uppercase tracking-widest text-[10px]"
                >
                  {isCheckingUrl ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking URL...
                    </>
                  ) : (
                    "Proceed to Write"
                  )}
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

        {/* FAQs */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
            Frequently Asked Questions
          </p>
          <Card className="border border-border bg-background rounded-none shadow-sm">
            <CardContent className="px-6 py-0 divide-y divide-border">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </CardContent>
          </Card>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 text-center leading-loose">
          Secure Registration • Identitree NFC
        </p>
      </div>
    </main>
  );
}
