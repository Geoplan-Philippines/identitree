
import { Zap, Shield, Smartphone, Terminal, Cpu } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Learn how to integrate, manage, and scale your NFC digital business card ecosystem with Identitree's professional tools.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="group relative overflow-hidden border border-border bg-muted/20 p-6 transition-colors hover:bg-muted/40">
          <Zap className="mb-4 size-6 text-foreground" />
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-foreground">Quick Start</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get up and running in minutes. Learn the basics of card issuance and profile management.
          </p>
        </div>
        
        <div className="group relative overflow-hidden border border-border bg-muted/20 p-6 transition-colors hover:bg-muted/40">
          <Terminal className="mb-4 size-6 text-foreground" />
          <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-foreground">API Reference</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Detailed documentation for our REST API, including authentication and card status endpoints.
          </p>
        </div>
      </div>

      <section className="space-y-8 pt-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">Platform Overview</h2>
          <div className="h-1 w-12 bg-foreground" />
        </div>

        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="flex size-10 shrink-0 items-center justify-center bg-foreground text-background">
              <Smartphone className="size-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">NFC Technology</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Identitree uses high-frequency NFC tags compatible with both iOS and Android. Our platform handles 
                NDEF record management and dynamic redirection seamlessly.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="flex size-10 shrink-0 items-center justify-center bg-foreground text-background">
              <Shield className="size-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Secure Registration</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Learn about our unique "Hardware-to-Profile" linking process that ensures physical cards 
                remain securely associated with their digital identities.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="flex size-10 shrink-0 items-center justify-center bg-foreground text-background">
              <Cpu className="size-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Every tap is recorded with granular data, including device type, geolocation, and referral 
                source, helping you measure networking ROI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
