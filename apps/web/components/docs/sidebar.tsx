
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  Settings, 
  Terminal, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Users,
  Search,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DocItem {
  label: string;
  href?: string;
  icon: any;
  subItems?: { label: string; href: string }[];
}

interface DocGroup {
  label: string;
  items: DocItem[];
}

const docGroups: DocGroup[] = [
  {
    label: "Introduction",
    items: [
      { label: "Getting Started", href: "/docs", icon: FileText },
    ],
  },
  {
    label: "NFC",
    items: [
      { 
        label: "NFC Ecosystem", 
        icon: Smartphone,
        subItems: [
          { label: "What is NFC?", href: "/docs/nfc" },
          { label: "Register Profile", href: "/docs/nfc/registration" },
        ]
      },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r border-sidebar-border top-14 h-[calc(100vh-56px)]">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <div className="md:hidden mb-4 px-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-sidebar-foreground/60" />
              <input
                type="search"
                placeholder="Search..."
                className="h-8 w-full rounded-lg border border-sidebar-border bg-sidebar-accent/40 pl-9 pr-3 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/60 outline-none"
              />
            </div>
          </div>
          
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-brass">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Zap className="size-4" />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {docGroups.map((group: DocGroup) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-brass">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item: DocItem) => {
                  if (item.subItems) {
                    const isAnySubActive = item.subItems.some(sub => pathname === sub.href);
                    
                    return (
                      <Collapsible
                        key={item.label}
                        asChild
                        defaultOpen={isAnySubActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.label}>
                              <item.icon className="size-4" />
                              <span className="text-sm">{item.label}</span>
                              <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((sub) => (
                                <SidebarMenuSubItem key={sub.label}>
                                  <SidebarMenuSubButton asChild isActive={pathname === sub.href}>
                                    <Link href={sub.href}>
                                      <span>{sub.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="h-9"
                      >
                        {item.href ? (
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        ) : (
                          <>
                            <item.icon className="size-4" />
                            <span className="text-sm">{item.label}</span>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
