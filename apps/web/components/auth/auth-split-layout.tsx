import type { ReactNode } from "react";
import Link from "next/link";

import { AuthShowcase } from "@/components/auth/auth-showcase";

type AuthSplitLayoutAction = {
  label: string;
  href: string;
  actionText: string;
};

type AuthSplitLayoutProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  secondaryAction?: AuthSplitLayoutAction;
  footerAction?: AuthSplitLayoutAction;
  children: ReactNode;
};

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  secondaryAction,
  footerAction,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen w-full bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Left Panel — Form */}
      <div className="relative flex min-h-screen flex-col px-6 py-8 sm:px-10 md:px-14 lg:px-16 xl:px-24">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span
              aria-hidden
              className="relative flex h-8 w-8 items-center justify-center bg-foreground text-background"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21V11" />
                <path d="M12 11c0-3.5 2.5-6 6-6" />
                <path d="M12 14c0-3.5-2.5-6-6-6" />
                <path d="M9 21h6" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Identitree
            </span>
          </Link>

          {secondaryAction && (
            <div className="hidden text-sm text-muted-foreground sm:flex sm:items-center sm:gap-2">
              <span>{secondaryAction.label}</span>
              <Link
                href={secondaryAction.href}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {secondaryAction.actionText}
              </Link>
            </div>
          )}
        </header>

        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[400px] py-10">
            <div className="mb-9">
              {eyebrow && (
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {eyebrow}
                </p>
              )}
              <h1 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {children}

            {footerAction && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {footerAction.label}{" "}
                <Link
                  href={footerAction.href}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {footerAction.actionText}
                </Link>
              </p>
            )}

            {secondaryAction && (
              <p className="mt-8 text-center text-sm text-muted-foreground sm:hidden">
                {secondaryAction.label}{" "}
                <Link
                  href={secondaryAction.href}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {secondaryAction.actionText}
                </Link>
              </p>
            )}
          </div>
        </div>

        <footer className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Identitree, Inc.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              All systems normal
            </span>
          </div>
        </footer>
      </div>

      {/* Right Panel — Showcase */}
      <AuthShowcase />
    </div>
  );
}
