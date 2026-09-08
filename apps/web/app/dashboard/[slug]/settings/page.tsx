import {
  Building,
  Users,
  CreditCard,
  Bell,
  Settings,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

import { OrganizationSettingsForm } from "@/components/settings/organization-settings-form";
import { cn } from "@/lib/utils";
import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { PageHeader } from "@/components/shared/page-shell";

// Coming-soon settings tabs are hidden for now. Flip this to `true` to show the
// Members / Billing / Notifications tabs (with a "Soon" badge) again.
const SHOW_COMING_SOON: boolean = false;

const settingsOptions = [
  {
    id: "organization",
    label: "Organization",
    description: "Manage your organization details and branding",
    icon: Building
  },
  {
    id: "members",
    label: "Members",
    description: "Manage team members and roles",
    icon: Users,
    comingSoon: true
  },
  {
    id: "billing",
    label: "Billing",
    description: "Manage your subscription and invoices",
    icon: CreditCard,
    comingSoon: true
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Configure how you receive updates",
    icon: Bell,
    comingSoon: true
  },
];

type SettingsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function SettingsPage({ params, searchParams }: SettingsPageProps) {
  const { slug } = await params;
  const { tab = "organization" } = await searchParams;

  await requireOrganizationAccess(slug);

  return (
    <div className="space-y-10 w-full min-h-full flex flex-col">
      <PageHeader
        title="Settings"
        description="Manage your organization and account preferences."
      />

      <div className="flex flex-col md:flex-row gap-10 flex-1">
        {/* Settings Navigation Menu */}
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible w-full md:w-56 shrink-0 gap-1 pb-2 md:pb-0 md:pr-4 border-b md:border-b-0 md:border-r border-border scrollbar-hide">
          {settingsOptions
            .filter((option) => SHOW_COMING_SOON || !option.comingSoon)
            .map((option) => {
            const isActive = tab === option.id;
            const href = `/dashboard/${slug}/settings?tab=${option.id}`;

            if (option.comingSoon) {
              return (
                <div
                  key={option.id}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                >
                  <option.icon className="size-4 shrink-0" />
                  <span>{option.label}</span>
                  <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-normal">Soon</span>
                </div>
              );
            }

            return (
              <Link
                key={option.id}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <option.icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                <span>{option.label}</span>
                {isActive && <ChevronRight className="ml-auto size-3" />}
              </Link>
            );
          })}
        </nav>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-background">
            {tab === "organization" && <OrganizationSettingsForm slug={slug} />}
            {tab !== "organization" && (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-xl">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Settings className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  This settings section is currently under development and will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
