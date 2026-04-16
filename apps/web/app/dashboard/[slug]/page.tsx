type DashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardSlugPage({ params }: DashboardPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-6 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to organization <span className="font-medium text-foreground">{slug}</span>.
      </p>
    </main>
  );
}
