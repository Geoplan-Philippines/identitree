"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  ContactRound,
  CreditCard,
  GalleryVerticalEnd,
  IdCard,
  LayoutDashboard,
  LayoutTemplate,
  Nfc,
  LogOut,
  Palette,
  Plus,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NewNfcCardDialog } from "@/components/nfc/new-nfc-card-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logoutAction } from "@/lib/auth/actions";
import { useParams, usePathname } from "next/navigation";

type DashboardShellProps = {
  children: ReactNode;
};

type DashboardLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
};

const growthLinks: DashboardLink[] = [
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Brand kit", href: "#", icon: Palette },
  { label: "NFC devices", href: "#", icon: Nfc },
  { label: "Billing", href: "#", icon: CreditCard },
];

function DashboardSidebar() {
  const params = useParams();
  const pathname = usePathname();

  const slug = params?.slug as string;

  const primaryLinks: DashboardLink[] = [
    { label: "Overview", href: `/dashboard/${slug}`, icon: LayoutDashboard },
    { label: "Cards", href: `/dashboard/${slug}/cards`, icon: IdCard },
    { label: "Contacts", href: `/dashboard/${slug}/contacts`, icon: ContactRound },
    { label: "Teams", href: `/dashboard/${slug}/teams`, icon: Users },
    { label: "Templates", href: `/dashboard/${slug}/templates`, icon: LayoutTemplate },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border top-12 !h-[calc(100svh-48px)]">
      {/* Hand-rolled header to perfectly match the main header height (h-14) without extra gaps */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-10 rounded-md">
              <Link href="/dashboard">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                  <GalleryVerticalEnd className="size-3.5" aria-hidden="true" />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-[13px]">Identitree</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    NFC business cards
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryLinks.map((item) => {
                const isOverview = item.href === `/dashboard/${slug}`;
                const isActive = isOverview
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Growth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthLinks.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit" tooltip="Log out">
                <LogOut aria-hidden="true" />
                <span>Log out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Account">
              <Link href="#">
                <Avatar size="sm">
                  <AvatarFallback className="text-xs font-medium">ID</AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-[13px] font-medium">Workspace admin</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    Pro plan
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top promotional banner (fixed to top) */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-12 w-full items-center justify-center gap-3 bg-[#131415] px-4 py-2.5 text-sm font-medium text-white">
        <span className="flex items-center gap-2">
          Try Pro for free — <span className="hidden opacity-80 sm:inline text-white/80">our most popular plan for content creators and businesses.</span>
        </span>
        <Link
          href="/pricing"
          className="flex h-7 items-center justify-center rounded-full bg-[#E5F5EC]/10 px-3 text-[11px] font-bold text-[#10B981] border border-[#10B981]/20 transition-colors hover:bg-[#10B981]/20 hover:border-[#10B981]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 uppercase tracking-wide"
        >
          <Zap className="mr-1.5 size-[11px] fill-current" aria-hidden="true" />
          Upgrade
        </Link>
      </div>

      <TooltipProvider>
        {/* Set SidebarProvider to not manage overall height since we have a fixed banner */}
        <SidebarProvider className="flex-1 overflow-hidden" style={{ minHeight: "calc(100svh - 48px)" }}>
          <DashboardSidebar />
          {/* Add mt-12 so the inset starts below the banner */}
          <SidebarInset className="flex flex-col overflow-hidden mt-12 bg-background h-[calc(100svh-48px)]">
            <header className="flex-none flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-5">
              <div className="flex items-center gap-3">
                <SidebarTrigger
                  className="-ml-1 size-8 rounded-none"
                  aria-label="Toggle sidebar"
                />

                <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />

                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-black uppercase tracking-widest text-foreground">
                    Management
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-none hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" aria-hidden="true" />
                </Button>

                <NewNfcCardDialog />
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-8 md:px-6 min-h-0 scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
