"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  ContactRound,
  IdCard,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Nfc,
  Palette,
  Plus,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import posthog from "posthog-js";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WingMark } from "@/components/shared/logo";
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
import React from "react";

type DashboardShellProps = {
  children: ReactNode;
};

type DashboardLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
};

// Coming-soon nav features are hidden for now. Flip this to `true` to show the
// "Coming Soon" and "Growth" sidebar groups again once the features are built.
const SHOW_COMING_SOON: boolean = false;



function DashboardSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const slug = params?.slug as string;
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return "HS";
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border h-svh">
      {/* Hand-rolled header to perfectly match the main header height (h-14) without extra gaps */}
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-10 rounded-md">
              <Link href="/dashboard">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brass">
                  <WingMark variant="gilt" className="w-4" />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-display font-semibold lowercase text-[13px]">handshakes</span>
                  <span className="truncate text-[11px] text-sidebar-foreground/70">
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
          <SidebarGroupLabel className="text-brass">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
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

        {SHOW_COMING_SOON && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-brass">Coming Soon</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {comingSoonLinks.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={`${item.label} (Coming Soon)`}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        posthog.capture("coming_soon_clicked", {
                          feature: item.label,
                          category: "Coming Soon",
                        });
                        toast.info(`${item.label} is coming soon!`, {
                          description: "We're working hard to bring this feature to you.",
                        });
                      }}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {SHOW_COMING_SOON && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-brass">Growth (Coming Soon)</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {growthLinks.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={`${item.label} (Coming Soon)`}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                      onClick={() => {
                        posthog.capture("coming_soon_clicked", {
                          feature: item.label,
                          category: "Growth",
                        });
                        toast.info(`${item.label} is coming soon!`, {
                          description: "We're working hard to bring this feature to you.",
                        });
                      }}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-transparent">
        <SidebarMenu className="gap-1">
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
                posthog.reset();
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
                    {isMounted ? getInitials(user?.name) : "HS"}
                  </AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-[13px] font-medium">
                    {isMounted ? (user?.name || "User") : "User"}
                  </span>
                  <span className="truncate text-[11px] text-sidebar-foreground/70">
                    {isMounted ? (user?.email || "Account") : "Account"}
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
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TooltipProvider>
        <SidebarProvider className="flex-1 overflow-hidden">
          <DashboardSidebar />
          <SidebarInset className="flex flex-col overflow-hidden bg-background h-svh">
            <header className="flex-none flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-5">
              <div className="flex items-center gap-3">
                <SidebarTrigger
                  className="-ml-1 size-8 rounded-lg"
                  aria-label="Toggle sidebar"
                />

                <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />

                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
                    Management
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <NotificationsPopover />

                <NfcCardDialog
                  trigger={
                    <Button>
                      <Plus className="size-3.5" aria-hidden="true" />
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