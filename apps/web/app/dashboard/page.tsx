import Link from "next/link";

export default function DashboardIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Organization required</h1>
      <p className="text-muted-foreground">
        Create an organization first before accessing dashboard pages.
      </p>
      <Link href="/organization/setup" className="underline underline-offset-4">
        Set up organization
      </Link>
    </main>
  );
}
