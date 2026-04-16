type DashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardSlugPage({ params }: DashboardPageProps) {
  const { slug } = await params;

  return (
    <section className="main-container space-y-1">
      <h1 className="text-xl font-semibold text-foreground">Overview</h1>
      <p className="text-sm text-muted-foreground">
        Welcome to{" "}
        <span className="font-medium text-foreground">{slug}</span> workspace.
      </p>
    </section>
  );
}
