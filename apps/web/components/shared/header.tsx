"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";

const navigationLinks = [
  { label: "Product", href: "#product" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Interpolate border color opacity and box shadow on scroll
  const borderColor = useTransform(
    scrollY,
    [0, 64],
    ["oklch(0.91 0 0 / 0)", "oklch(0.91 0 0 / 1)"],
  );

  if (pathname !== "/") {
    return null;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-md"
      style={{ borderBottomColor: borderColor, borderBottomWidth: 1, borderBottomStyle: "solid" }}
    >
      <div className="main-container flex h-14 items-center justify-between gap-8">
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Identitree home"
          className="flex items-center gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <span
            className="flex size-6 items-center justify-center rounded-[5px] bg-foreground text-background text-[10px] font-bold tracking-tight select-none"
            aria-hidden="true"
          >
            I
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Identitree
          </span>
        </Link>

        {/* Nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
