
import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsHeader } from "@/components/docs/header";
import { DocsSidebar } from "@/components/docs/sidebar";
import { Logo } from "@/components/shared/logo";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="flex min-h-[100dvh] w-full flex-col">
        <DocsHeader />
        <div className="flex flex-1">
          <DocsSidebar />
          <SidebarInset className="flex w-full flex-col bg-background">
            <main className="flex-1 px-4 py-10 md:px-8 lg:px-12">
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
              </div>
            </main>

            <footer className="border-t border-border py-12 px-4 md:px-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <Logo className="text-foreground" wordClassName="text-sm" />
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    The premium ecosystem for NFC digital business cards and professional identities.
                  </p>
                </div>

                <div className="flex gap-12">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Resources</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Community</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                      <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  © {new Date().getFullYear()} Geoplan Philippines. All rights reserved.
                </p>
              </div>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
