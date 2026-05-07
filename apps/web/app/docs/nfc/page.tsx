import { Smartphone, Zap, Layers, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFC Technology Guide",
  description: "Comprehensive guide to Identitree's NFC digital business card technology, compatibility, and best practices.",
  alternates: {
    canonical: "https://identitree.geoplanph.com/docs/nfc",
  },
};


export default function NfcDocsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <Smartphone className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Core Concepts</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
          NFC Technology
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Understanding how Near Field Communication works within the Identitree ecosystem to bridge physical cards and digital identities.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 border border-border bg-muted/20 p-8">
          <div className="bg-foreground text-background size-10 flex items-center justify-center">
            <Layers className="size-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">NDEF Records</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Identitree uses the NFC Data Exchange Format (NDEF) to store URL records. These records are 
            dynamically updated during the claim process to point to the user's digital profile.
          </p>
        </div>

        <div className="space-y-4 border border-border bg-muted/20 p-8">
          <div className="bg-foreground text-background size-10 flex items-center justify-center">
            <RefreshCw className="size-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Dynamic Redirection</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike static business cards, Identitree cards use server-side logic to redirect taps. This 
            allows you to update your profile link without needing to re-issue the physical card.
          </p>
        </div>
      </div>

      <section className="space-y-8 pt-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">Hardware Specifications</h2>
          <div className="h-1 w-12 bg-foreground" />
        </div>

        <div className="prose prose-sm prose-invert max-w-none">
          <table className="w-full text-left border-collapse border border-border text-xs">
            <thead>
              <tr className="bg-muted/40 uppercase tracking-widest font-black text-[10px]">
                <th className="p-4 border border-border">Feature</th>
                <th className="p-4 border border-border">Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-border font-bold">Chip Type</td>
                <td className="p-4 border border-border text-muted-foreground">NXP NTAG213 / NTAG215</td>
              </tr>
              <tr>
                <td className="p-4 border border-border font-bold">Frequency</td>
                <td className="p-4 border border-border text-muted-foreground">13.56 MHz (HF)</td>
              </tr>
              <tr>
                <td className="p-4 border border-border font-bold">Standard</td>
                <td className="p-4 border border-border text-muted-foreground">ISO/IEC 14443-A</td>
              </tr>
              <tr>
                <td className="p-4 border border-border font-bold">Memory</td>
                <td className="p-4 border border-border text-muted-foreground">144 / 504 Bytes User Memory</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6 pt-8 bg-foreground text-background p-10">
        <div className="flex items-center gap-3">
          <Zap className="size-6 fill-current" />
          <h2 className="text-2xl font-black uppercase tracking-tight">Best Practices</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="flex gap-3 items-start">
            <div className="bg-background text-foreground size-5 shrink-0 flex items-center justify-center text-[10px] font-bold">1</div>
            <p className="text-xs font-medium leading-relaxed opacity-90">Always test the card tap with both iOS and Android before mass distribution.</p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="bg-background text-foreground size-5 shrink-0 flex items-center justify-center text-[10px] font-bold">2</div>
            <p className="text-xs font-medium leading-relaxed opacity-90">Avoid placing NFC tags on metal surfaces which can interfere with the radio signal.</p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="bg-background text-foreground size-5 shrink-0 flex items-center justify-center text-[10px] font-bold">3</div>
            <p className="text-xs font-medium leading-relaxed opacity-90">Use the Identitree Claim portal to securely link hardware IDs to digital profiles.</p>
          </li>
          <li className="flex gap-3 items-start">
            <div className="bg-background text-foreground size-5 shrink-0 flex items-center justify-center text-[10px] font-bold">4</div>
            <p className="text-xs font-medium leading-relaxed opacity-90">Monitor tap analytics in real-time through your personal dashboard.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
