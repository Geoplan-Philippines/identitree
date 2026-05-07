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
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NfcCardDialog } from "@/components/nfc/nfc-card-dialog";
import { NotificationsPopover } from "@/components/dashboard/notifications-popover";
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
import { authClient } from "@/lib/auth-client";
import { useParams, usePathname, useRouter } from "next/navigation";

type DashboardShellProps = {
  children: ReactNode;
};

type DashboardLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
};



function DashboardSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const slug = params?.slug as string;
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const getInitials = (name?: string | null) => {
    if (!name) return "ID";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const workspaceLinks: DashboardLink[] = [
    { label: "Overview", href: `/dashboard/${slug}`, icon: LayoutDashboard },
    { label: "Cards", href: `/dashboard/${slug}/cards`, icon: IdCard },
    { label: "Templates", href: `/dashboard/${slug}/templates`, icon: LayoutTemplate },
    { label: "Analytics", href: `/dashboard/${slug}/analytics`, icon: BarChart3 },
    { label: "Tools", href: `/dashboard/${slug}/tools`, icon: Wrench },
  ];

  const comingSoonLinks: DashboardLink[] = [
    { label: "Contacts", href: "#", icon: ContactRound },
    { label: "Teams", href: "#", icon: Users },
  ];

  const growthLinks: DashboardLink[] = [
    { label: "Brand Kit", href: "#", icon: Palette },
    { label: "NFC Devices", href: "#", icon: Nfc },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border h-svh">
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
              {workspaceLinks.map((item) => {
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
          <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {comingSoonLinks.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={`${item.label} (Coming Soon)`}
                    disabled
                  >
                    <Link href={item.href} className="opacity-50 cursor-not-allowed">
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
          <SidebarGroupLabel>Growth (Coming Soon)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthLinks.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={`${item.label} (Coming Soon)`}
                    disabled
                  >
                    <Link href={item.href} className="opacity-50 cursor-not-allowed">
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
              <Link href={`/dashboard/${slug}/settings`}>
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
            >
              <LogOut aria-hidden="true" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Account">
              <Link href={`/dashboard/${slug}/account`}>
                <Avatar size="sm">
                  {user?.image && (
                    <AvatarImage
                      src={user.image}
                      alt={user.name || "User avatar"}
                    />
                  )}
                  <AvatarFallback className="text-xs font-medium">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-[13px] font-medium">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user?.email || "Pro plan"}
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
      {/* <div className="fixed inset-x-0 top-0 z-50 flex h-12 w-full items-center justify-center gap-3 bg-[#131415] px-4 py-2.5 text-sm font-medium text-white">
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
      </div> */}

      <TooltipProvider>
        {/* Set SidebarProvider to not manage overall height since we have a fixed banner */}
        <SidebarProvider className="flex-1 overflow-hidden">
          <DashboardSidebar />
          {/* Add mt-12 so the inset starts below the banner */}
          <SidebarInset className="flex flex-col overflow-hidden bg-background h-svh">
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
                <NotificationsPopover />

                <NfcCardDialog
                  trigger={
                    <Button>
                      <Plus className="size-3.5 mr-1.5" aria-hidden="true" />
                      New card
                    </Button>
                  }
                />
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
