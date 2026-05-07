import type { ReactNode } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  title?: string;
  description?: string;
  footerLabel: string;
  footerHref: string;
  footerActionText: string;
  children: ReactNode;
};

export function AuthCard({
  title,
  description,
  footerLabel,
  footerHref,
  footerActionText,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-none">
        {(title || description) && (
          <CardHeader className="space-y-1 text-center">
            {title && <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </CardHeader>
        )}
        <CardContent>
          {children}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {footerLabel}{" "}
            <Link
              href={footerHref}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {footerActionText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
