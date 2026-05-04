
import Link from "next/link";
import { Zap, Link as LinkIcon, PenLine, CheckCircle2, Nfc, ExternalLink } from "lucide-react";

export default function NfcRegistrationDocsPage() {
  return (
    <div className="flex gap-10 xl:gap-16">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-16">
      {/* Header */}
      <section id="overview" className="space-y-4">
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

      {/* Quick Activation Section */}
      <section id="activate-page" className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Method 1: Quick Activation</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <div className="flex size-10 items-center justify-center bg-foreground text-background text-sm font-bold">
              <Nfc className="size-5" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Use the Activate Page</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The fastest way to link a customer-owned NFC card. Visit the activation portal, paste your profile link, then tap your card to the back of your phone — the card is written and registered in a single step.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Requirement:</span> Chrome browser on an Android phone with NFC enabled.
            </p>
            <Link
              href="/activate"
              target="_blank"
              className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Go to Activate Page
            </Link>
          </div>

          {/* Activate Page Screenshot */}
          <div className="relative w-full max-w-[280px] overflow-hidden border border-border bg-muted/30 mx-auto lg:mx-0">
            <a
              href="https://res.cloudinary.com/djfuei11u/image/upload/v1777876753/viber_image_2026-05-04_14-38-36-681_kvjllt.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full cursor-zoom-in"
            >
              <img
                src="https://res.cloudinary.com/djfuei11u/image/upload/v1777876753/viber_image_2026-05-04_14-38-36-681_kvjllt.jpg"
                alt="Identitree Activate Page - NFC Card Registration"
                className="w-full object-contain"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Phase 1: Dashboard Setup */}
      <section id="dashboard-setup" className="space-y-12">
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
      <section id="manual-activation" className="space-y-12">
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

      </div> {/* End main content */}

      {/* Right Sidebar — On this page */}
      <aside className="hidden xl:block w-52 shrink-0">
        <div className="sticky top-20 space-y-6">
          {/* On this page */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-1.5 border-l border-border pl-3">
              {[
                { href: "#overview", label: "Overview" },
                { href: "#activate-page", label: "Quick Activation" },
                { href: "#dashboard-setup", label: "Dashboard Setup" },
                { href: "#manual-activation", label: "Manual Activation" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Activation Methods */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Activation Methods
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/activate"
                  target="_blank"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Nfc className="size-3.5 shrink-0" />
                  <span>Activate Page</span>
                  <ExternalLink className="size-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </Link>
                <p className="text-[10px] text-muted-foreground/60 pl-5 mt-0.5 leading-relaxed">
                  Chrome on Android only
                </p>
              </li>
              <li>
                <a
                  href="#manual-activation"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PenLine className="size-3.5 shrink-0" />
                  <span>Manual (NFC Tools)</span>
                </a>
                <p className="text-[10px] text-muted-foreground/60 pl-5 mt-0.5 leading-relaxed">
                  Any NFC-enabled device
                </p>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
