import { AuthGuard } from "@/components/auth/auth-guard";
import Link from "next/link";

export default function RootPage() {
  return (
    <AuthGuard mode="public">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Identitree
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Identity and organization workspace for your team.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Manage users, organizations, and secure access in one place. Start by
          creating an account or signing in to continue.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </main>
    </AuthGuard>
  );
}