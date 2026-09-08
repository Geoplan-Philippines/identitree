import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon, LogInIcon } from "lucide-react";
import { getSession } from "@/lib/auth/session";

export default async function NotFound() {
  const session = await getSession();
  
  const href = session 
    ? (session.organizationSlug ? `/dashboard/${session.organizationSlug}` : "/dashboard")
    : "/login";
    
  const buttonText = session ? "Return to Dashboard" : "Sign in";
  const Icon = session ? MoveLeftIcon : LogInIcon;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8">
        <div className="space-y-3">
          <p className="font-display text-7xl font-semibold tracking-tight text-foreground">404</p>
          <div className="mx-auto h-px w-12 bg-brass" />
          <h1 className="font-display text-xl font-semibold text-foreground">Page not found</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We couldn&apos;t find the profile or page you were looking for.
          </p>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href={href}>
            <Icon className="h-4 w-4" />
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
