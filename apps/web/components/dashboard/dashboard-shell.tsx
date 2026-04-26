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

type DashboardShellProps = {
  children: ReactNode;
};

type DashboardLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
};

const primaryLinks: DashboardLink[] = [
  { label: "Overview", href: "#", icon: LayoutDashboard, isActive: true },
  { label: "Cards", href: "#", icon: IdCard },
  { label: "Contacts", href: "#", icon: ContactRound },
  { label: "Teams", href: "#", icon: Users },
  { label: "Templates", href: "#", icon: LayoutTemplate },
];

const growthLinks: DashboardLink[] = [
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Brand kit", href: "#", icon: Palette },
  { label: "NFC devices", href: "#", icon: Nfc },
  { label: "Billing", href: "#", icon: CreditCard },
];

function DashboardSidebar() {
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
              {primaryLinks.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.label}
                  >
                    <Link
                      href={item.href}
                      aria-current={item.isActive ? "page" : undefined}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
          <SidebarInset className="overflow-x-hidden mt-12 bg-background min-h-[calc(100svh-48px)]">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-5">
              <div className="flex items-center gap-3">
                <SidebarTrigger
                  className="-ml-1 size-8 rounded-md"
                  aria-label="Toggle sidebar"
                />

                <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />

                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-medium text-foreground">
                    Overview
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-md hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" aria-hidden="true" />
                </Button>

                <Button asChild>
                  <Link href="#">
                    <Plus className="size-3.5" aria-hidden="true" />
                    New card
                  </Link>
                </Button>
              </div>
            </header>

            <div className="flex-1 px-4 py-8 md:px-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
