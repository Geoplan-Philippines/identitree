import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { PageHeader } from "@/components/shared/page-shell";

type DashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardSlugPage({ params }: DashboardPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description={`Welcome to ${slug} workspace.`}
      />
    </div>
  );
}
