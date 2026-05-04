
import { Zap, Smartphone, Link as LinkIcon, CheckCircle2 } from "lucide-react";

export default function NfcRegistrationDocsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <Zap className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">NFC Guide</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
          Registration Flow
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A step-by-step guide on how to link your physical NFC card to your digital professional profile.
        </p>
      </section>

      <section className="relative space-y-12 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-32px)] before:w-px before:bg-border">
        {/* Step 1 */}
        <div className="relative flex gap-6">
          <div className="relative z-10 flex size-10 shrink-0 items-center justify-center bg-foreground text-background text-sm font-bold">
            1
          </div>
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Paste Your Profile URL</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Navigate to the <span className="text-foreground font-medium">/claim</span> page and paste your 
              digital business card link. This link uniquely identifies your record in our system.
            </p>
            <div className="mt-4 p-4 border border-border bg-muted/20 inline-flex items-center gap-3">
              <LinkIcon className="size-4 text-muted-foreground" />
              <code className="text-[10px] font-mono">identitree.ph/org/your-name</code>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex gap-6">
          <div className="relative z-10 flex size-10 shrink-0 items-center justify-center bg-foreground text-background text-sm font-bold">
            2
          </div>
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Initiate NFC Contact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Click the "Next" button to activate your device's NFC reader. You will see a visual cue 
              indicating that the system is ready to communicate with your card.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex gap-6">
          <div className="relative z-10 flex size-10 shrink-0 items-center justify-center bg-foreground text-background text-sm font-bold">
            3
          </div>
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Tap & Register</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Touch your physical card to the back of your smartphone. The system will automatically:
            </p>
            <ul className="grid gap-2 pt-2">
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-foreground" />
                Capture the physical Hardware ID (UID)
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-foreground" />
                Link the ID to your digital profile in the database
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-foreground" />
                Write the encoded URL (with tracking) back to the card
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-foreground bg-foreground p-8 text-background">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="size-6" />
          <h4 className="text-sm font-bold uppercase tracking-widest">Device Compatibility</h4>
        </div>
        <p className="text-xs leading-relaxed opacity-90">
          The registration flow requires a browser that supports the Web NFC API (currently available in Chrome for Android). 
          iPhone users can still tap cards to view profiles, but registration should be performed on a compatible device.
        </p>
      </div>
    </div>
  );
}
