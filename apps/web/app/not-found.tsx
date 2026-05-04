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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 border border-border rounded-none">
        <div className="space-y-4">
          <h1 className="text-8xl font-black tracking-tighter text-foreground">
            404
          </h1>
          <div className="h-px w-full bg-border" />
          <h2 className="text-[13px] font-black uppercase tracking-widest text-foreground">
            Page Not Found
          </h2>
        </div>
        
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
          The requested digital identity or resource could not be located on this server.
        </p>

        <div className="pt-4">
          <Button asChild className="w-full rounded-none font-bold uppercase tracking-widest text-[11px]" size="lg">
            <Link href={href}>
              <Icon className="mr-2 h-4 w-4" />
              {buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
