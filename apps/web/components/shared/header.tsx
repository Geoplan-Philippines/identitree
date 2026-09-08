"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Logo } from "@/components/shared/logo";

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // The bar dissolves into the forest ground at rest and settles as the reader scrolls.
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(13, 42, 31, 0)", "rgba(13, 42, 31, 0.82)"],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(243, 236, 217, 0)", "rgba(243, 236, 217, 0.12)"],
  );
  const backdropBlur = useTransform(scrollY, [0, 80], [0, 12]);
  const backdropFilter = useTransform(backdropBlur, (v) => `blur(${v}px)`);

  if (pathname !== "/") {
    return null;
  }

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
      }}
      className="fixed inset-x-0 top-0 z-40 text-cream"
    >
      <div className="main-container flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Handshakes home"
          className="flex items-center rounded-sm outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/40"
        >
          <Logo variant="ink" priority markClassName="w-8" wordClassName="text-[15px]" />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-cream/75 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-brass px-4 py-2 text-sm font-semibold text-brass-foreground transition hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-forest-ink"
          >
            Create card
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
