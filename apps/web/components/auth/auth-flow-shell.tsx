import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

type Step = {
  number: string;
  label: string;
};

type AuthFlowShellProps = {
  currentStep: 1 | 2;
  steps: [Step, Step];
  heading: ReactNode;
  subheading?: ReactNode;
  navAction?: {
    prompt: string;
    label: string;
    href: string;
  };
  /** Tiny meta text shown under the form (e.g. terms acceptance). */
  finePrint?: ReactNode;
  children: ReactNode;
};

export function AuthFlowShell({
  currentStep,
  steps,
  heading,
  subheading,
  navAction,
  finePrint,
  children,
}: AuthFlowShellProps) {
  return (
    <div className="grid min-h-[100dvh] w-full bg-background text-foreground lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Left Panel — Editorial Hero */}
      <aside className="relative hidden overflow-hidden bg-forest-ink lg:block">
        <Image
          src="/assets/register-hero.png"
          alt="Handshakes NFC credentials in use"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-center"
        />

        {/* Subtle top gradient for logo legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />

        {/* Top-left: brand on image */}
        <div className="absolute left-10 top-10 z-10 text-white xl:left-14 xl:top-12">
          <Logo variant="ink" markClassName="w-8" wordClassName="text-[17px]" />
        </div>
      </aside>

      {/* Right Panel — Step Content */}
      <div className="relative flex min-h-[100dvh] flex-col px-6 py-8 sm:px-10 md:px-14 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between">
          {/* Brand on mobile (hero hidden); invisible on desktop to preserve space */}
          <Link
            href="/"
            className="group inline-flex items-center text-foreground transition-opacity hover:opacity-90 lg:invisible"
          >
            <Logo markClassName="w-8" wordClassName="text-[17px]" />
          </Link>

          {navAction && (
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">{navAction.prompt} </span>
              <Link
                href={navAction.href}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {navAction.label}
              </Link>
            </div>
          )}
        </header>

        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[420px] py-10">
            <Stepper currentStep={currentStep} steps={steps} />

            <div className="mb-8">
              <h1 className="text-[30px] font-semibold leading-[1.1] tracking-tight text-foreground">
                {heading}
              </h1>
              {subheading && (
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                  {subheading}
                </p>
              )}
            </div>

            {children}

            {finePrint && (
              <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
                {finePrint}
              </p>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-between pt-6 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Handshakes, Inc.</p>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems normal
          </span>
        </footer>
      </div>
    </div>
  );
}

function Stepper({
  currentStep,
  steps,
}: {
  currentStep: 1 | 2;
  steps: [Step, Step];
}) {
  return (
    <div className="mb-8 inline-flex w-full items-center gap-3">
      <StepBadge state={currentStep > 1 ? "done" : "active"} number={steps[0].number} />
      <span
        className={
          currentStep === 1
            ? "text-[11px] font-medium uppercase tracking-[0.16em] text-foreground"
            : "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        }
      >
        {steps[0].label}
      </span>
      <span className="h-px flex-1 bg-border" />
      <StepBadge state={currentStep === 2 ? "active" : "upcoming"} number={steps[1].number} />
      <span
        className={
          currentStep === 2
            ? "text-[11px] font-medium uppercase tracking-[0.16em] text-foreground"
            : "text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/50"
        }
      >
        {steps[1].label}
      </span>
    </div>
  );
}

function StepBadge({
  state,
  number,
}: {
  state: "done" | "active" | "upcoming";
  number: string;
}) {
  if (state === "done") {
    return (
      <span
        aria-label="Completed"
        className="flex h-6 w-6 items-center justify-center bg-foreground text-background"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="flex h-6 w-6 items-center justify-center border border-foreground bg-foreground text-[11px] font-semibold tabular-nums text-background">
        {number}
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center border border-foreground/15 bg-background text-[11px] font-semibold tabular-nums text-muted-foreground/60">
      {number}
    </span>
  );
}
