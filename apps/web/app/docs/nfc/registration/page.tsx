
import { Zap, Smartphone, Link as LinkIcon, Download, PenLine, CheckCircle2, ChevronRight, Image as ImageIcon } from "lucide-react";

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-muted/30 flex flex-col items-center justify-center gap-2">
      <ImageIcon className="size-8 text-muted-foreground/40" />
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
    </div>
  );
}

export default function NfcRegistrationDocsPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <Zap className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">NFC Guide</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
          NFC Card Setup
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Follow this visual guide to link your physical NFC card to your digital professional profile.
        </p>
      </section>

      {/* Phase 1: Dashboard Setup */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Phase 1: Dashboard Configuration</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">01</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Create & Configure</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log in to your dashboard and create a new card. Once created, click <span className="text-foreground font-bold italic underline underline-offset-4 decoration-border/50">View Details</span> to start building your digital profile.
              </p>
              <div className="p-4 border border-border bg-muted/20 inline-flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                <LinkIcon className="size-3.5" />
                Copy your profile link
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-muted/30">
              <a
                href="https://res.cloudinary.com/djfuei11u/image/upload/v1777868803/ChatGPT_Image_May_4_2026_12_26_30_PM_tfp7vc.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full cursor-zoom-in"
              >
                <img
                  src="https://res.cloudinary.com/djfuei11u/image/upload/v1777868803/ChatGPT_Image_May_4_2026_12_26_30_PM_tfp7vc.png"
                  alt="Identitree Dashboard - Create and Configure Card"
                  className="h-full w-full object-contain"
                />
              </a>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:order-last">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">02</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Add Your Details</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add your name, role, contact info, and branding. Ensure everything looks perfect on the preview before proceeding to encode the physical card.
              </p>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-muted/30">
              <a
                href="https://res.cloudinary.com/djfuei11u/image/upload/v1777868964/Screenshot_2026-05-04_122902_to9nvm.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full cursor-zoom-in"
              >
                <img
                  src="https://res.cloudinary.com/djfuei11u/image/upload/v1777868964/Screenshot_2026-05-04_122902_to9nvm.png"
                  alt="Identitree Profile Editor - Add Your Details"
                  className="h-full w-full object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2: Physical Encoding */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Phase 2: Card Encoding</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-16">
          {/* Step 3: Download */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">03</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Get the App</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download <span className="text-foreground font-bold underline decoration-border/50 underline-offset-4 italic">NFC Tools</span> from the Play Store or App Store to begin.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777869620/viber_image_2026-05-04_12-39-49-440_fmpuez.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777869620/viber_image_2026-05-04_12-39-49-440_fmpuez.jpg"
                    alt="NFC Tools on Play Store"
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 4: Open & Initial Tap */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:order-last">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">04</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Initialize Contact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Open the app and approach your physical card to the back of your phone while on the <span className="text-foreground font-bold italic">Read</span> tab.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777869743/viber_image_2026-05-04_12-39-49-471_tsdlnc.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777869743/viber_image_2026-05-04_12-39-49-471_tsdlnc.jpg"
                    alt="NFC Tools App - Open Interface"
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 5: Preview */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">05</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Verify Card Data</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once tapped, the app will show a preview of the card's current data. Confirm the card is detected before proceeding.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777869694/viber_image_2026-05-04_12-39-49-506_senk2o.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777869694/viber_image_2026-05-04_12-39-49-506_senk2o.jpg"
                    alt="NFC Tools App - Post-Tap Preview"
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 6: Navigate to Write */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:order-last">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">06</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Switch to Write</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tap the <span className="text-foreground font-bold italic">Write</span> tab in the top navigation menu to access the encoding tools.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777869908/ChatGPT_Image_May_4_2026_12_44_56_PM_lvfzmx.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777869908/ChatGPT_Image_May_4_2026_12_44_56_PM_lvfzmx.png"
                    alt="NFC Tools App - Write Tab Selection"
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 7: Start New Record */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">07</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Start New Record</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                On the <span className="text-foreground font-bold italic">Write</span> tab, click <span className="text-foreground font-bold italic">Add a record</span> and select the <span className="text-foreground font-bold italic underline decoration-border/50 underline-offset-4">URL / URI</span> option.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a 
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777870282/Gemini_Generated_Image_a1pe7ha1pe7ha1pe_yxee0j.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img 
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777870282/Gemini_Generated_Image_a1pe7ha1pe7ha1pe_yxee0j.png" 
                    alt="NFC Tools App - Select URL Type" 
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 8: Input Profile Link */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:order-last">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">08</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Input Profile Link</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ensure you select <span className="text-foreground font-bold italic underline decoration-emerald-500/50 underline-offset-4">https://</span> from the protocol dropdown. Paste your Identitree profile link and tap <span className="text-foreground font-bold italic">OK</span>.
              </p>
              <div className="p-3 border border-border border-dashed bg-muted/10 text-[10px] font-mono text-muted-foreground">
                <span className="text-foreground font-bold uppercase tracking-widest block mb-1">Example Format:</span>
                identitree.geoplanph.com/org-slug/name-slug?ref=nfc_tap
              </div>
              <div className="bg-foreground text-background p-4 text-[10px] leading-relaxed font-bold">
                <span className="underline decoration-background/50 underline-offset-4 uppercase tracking-widest">Critical:</span> To track performance, always append <code className="bg-background/20 px-1 py-0.5 font-mono">?ref=nfc_tap</code> to your URL. This distinguishes physical taps from QR/Web traffic.
              </div>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a 
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777870675/Gemini_Generated_Image_5n4r5n5n4r5n5n4r_n50let.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img 
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777870675/Gemini_Generated_Image_5n4r5n5n4r5n5n4r_n50let.png" 
                    alt="NFC Tools App - Input Profile Link" 
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 9: Prepare to Write */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">09</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Prepare to Write</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tap the <span className="text-foreground font-bold italic">Write / [X] Bytes</span> button. The "Approach an NFC Tag" prompt will appear.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a 
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777870919/Gemini_Generated_Image_hjp6xghjp6xghjp6_tw7ofi.png" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img 
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777870919/Gemini_Generated_Image_hjp6xghjp6xghjp6_tw7ofi.png" 
                    alt="NFC Tools App - Write x Bytes" 
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 10: Approach Card */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 lg:order-last">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">10</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Approach Card</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hold your physical card against the back of your phone as shown in the "Approach an NFC Tag" prompt. Maintain contact until the operation completes.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a 
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777870984/viber_image_2026-05-04_12-39-49-641_a5odh3.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img 
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777870984/viber_image_2026-05-04_12-39-49-641_a5odh3.jpg" 
                    alt="NFC Tools App - Approach Card Prompt" 
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Step 11: Success Confirmation */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">11</div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Success</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The app will display a large green checkmark and the message <span className="text-emerald-500 font-bold italic underline underline-offset-4 decoration-emerald-500/50">Done!</span> your card is now successfully linked.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
                <CheckCircle2 className="size-4" />
                Setup Complete
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] overflow-hidden border border-border bg-muted/30">
                <a 
                  href="https://res.cloudinary.com/djfuei11u/image/upload/v1777870983/viber_image_2026-05-04_12-39-49-670_kqrpnu.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-full w-full cursor-zoom-in"
                >
                  <img 
                    src="https://res.cloudinary.com/djfuei11u/image/upload/v1777870983/viber_image_2026-05-04_12-39-49-670_kqrpnu.jpg" 
                    alt="NFC Tools App - Success Confirmation" 
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tip Footer */}
      <div className="bg-foreground text-background p-10 space-y-6">
        <div className="flex items-center gap-3">
          <PenLine className="size-6" />
          <h4 className="text-xl font-black uppercase tracking-tight">Analytics Tracking</h4>
        </div>
        <p className="text-sm leading-relaxed opacity-90 max-w-2xl">
          To track performance, append <code className="bg-background/20 px-1.5 py-0.5 font-mono">?ref=nfc_tap</code> to your URL. This allows Identitree to distinguish between QR codes, direct links, and physical card taps.
        </p>
      </div>
    </div>
  );
}
