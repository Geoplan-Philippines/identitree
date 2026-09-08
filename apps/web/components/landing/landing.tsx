"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Logo, WingMark } from "@/components/shared/logo";

export function Landing() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden bg-forest-ink text-cream">
      {/* One warm light source — not a grid, not a glow field. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-[-6%] top-[8%] h-[620px] w-[620px] rounded-full bg-brass/[0.10] blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-black/25 to-transparent" />
      </div>

      <Hero />
      <Ritual />

      <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-cream/10 px-6 py-7 text-[11px] uppercase tracking-[0.18em] text-cream/45 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <span>Tap. Connect. Done.</span>
        <span className="text-cream/30">
          &copy; {new Date().getFullYear()} Handshakes
        </span>
      </footer>

      <style>{`
        .rise { animation: hs-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes hs-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 1; }
        @supports (animation-timeline: view()) {
          .reveal {
            animation: hs-reveal linear both;
            animation-timeline: view();
            animation-range: entry 5% entry 42%;
          }
          @keyframes hs-reveal {
            from { opacity: 0; transform: translateY(26px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rise, .reveal { animation: none; }
        }
      `}</style>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center gap-14 px-6 pb-20 pt-28 sm:px-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pt-24">
      {/* The ritual, in words */}
      <div className="max-w-xl">
        <h1
          className="rise font-display text-[clamp(2.4rem,5.4vw,4.25rem)] font-semibold leading-[1.03] tracking-[-0.03em] [text-wrap:balance]"
          style={{ animationDelay: "0.05s" }}
        >
          Before business cards,
          <br className="hidden sm:block" /> there were{" "}
          <span className="italic text-brass">handshakes.</span>
        </h1>

        <p
          className="rise mt-7 max-w-md text-[15px] leading-relaxed text-cream/70 sm:text-base"
          style={{ animationDelay: "0.16s" }}
        >
          A universal gesture of trust, introduction, and connection,
          modernized into a single tap. No app to install, nothing to hand over
          but your name.
        </p>

        <div
          className="rise mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "0.26s" }}
        >
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brass px-7 text-sm font-semibold text-brass-foreground transition hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-forest-ink"
          >
            Create your card
          </Link>
          <Link
            href="#ritual"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-cream/25 px-7 text-sm font-medium text-cream transition hover:border-cream/50 hover:bg-cream/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/40"
          >
            The ritual
          </Link>
        </div>

        <p
          className="rise mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-cream/50"
          style={{ animationDelay: "0.36s" }}
        >
          <span>No app to install</span>
          <span className="text-brass/60">·</span>
          <span>Verified identity</span>
          <span className="text-brass/60">·</span>
          <span>Works on every phone</span>
        </p>
      </div>

      {/* The object itself */}
      <div className="rise flex justify-center lg:justify-end" style={{ animationDelay: "0.2s" }}>
        <TiltCard />
      </div>
    </section>
  );
}

function TiltCard() {
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const sheenX = useTransform(px, [-0.5, 0.5], [18, 82]);
  const sheenY = useTransform(py, [-0.5, 0.5], [12, 88]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(243, 236, 217, 0.16), transparent 55%)`;

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      className="relative w-full max-w-[430px] [perspective:1200px]"
      onPointerMove={track}
      onPointerLeave={reset}
    >
      {/* Back face — the fallback card, peeking */}
      <div className="absolute -left-5 top-8 aspect-[1.586/1] w-[82%] -rotate-[7deg] rounded-2xl border border-black/5 bg-cream px-6 py-5 text-forest-ink shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)]">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <WingMark variant="folio" className="w-7" />
            <span className="font-display text-[10px] tracking-[0.1em] text-forest-ink/45">
              handshakes.cards
            </span>
          </div>
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.16em] text-forest-ink/40">
            Scan if no tap
          </p>
        </div>
      </div>

      {/* Front face — a gentle float (outer) carries the pointer tilt (inner) */}
      <motion.div
        className="relative ml-auto w-[88%] [transform-style:preserve-3d]"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 7, ease: "easeInOut", repeat: Infinity }
        }
      >
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { rotateX, rotateY, transformStyle: "preserve-3d" }
          }
          className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-forest to-forest-ink p-7 shadow-[0_50px_110px_-35px_rgba(0,0,0,0.8)]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brass/15 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <Logo variant="ink" markClassName="w-7" wordClassName="text-[15px]" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-brass">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            Verified
          </span>
        </div>

        <div className="relative mt-9">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40">
            Tap to introduce
          </p>
          <p className="mt-2 font-display text-[26px] font-semibold tracking-tight text-cream">
            Handshakes
          </p>
          <p className="text-[13px] text-cream/55">Your digital business card</p>
        </div>

        <div className="relative mt-7 flex items-end justify-between">
          <span className="relative inline-flex h-7 w-9 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#E6C583] to-brass">
            <span className="block h-3.5 w-5 rounded-[2px] border border-brass-foreground/30" />
          </span>
          <p className="font-display text-[10px] tracking-[0.22em] text-cream/40">
            85.6 × 53.98 mm
          </p>
        </div>

          {/* Specular sheen follows the pointer */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: sheen }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Ritual() {
  const principles = [
    {
      title: "Names the ritual",
      body: "It’s the handshake people remember, not the technology behind it.",
    },
    {
      title: "Universally understood",
      body: "No translation, no jargon. A gesture everyone already knows.",
    },
    {
      title: "Premium by default",
      body: "Brass on ink. Quiet, certain, made to be handed over.",
    },
  ];

  return (
    <section
      id="ritual"
      className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 lg:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="reveal">
          <WingMark variant="ink" className="w-28" />
          <h2 className="mt-8 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Two arcs.
            <br />
            One meeting point.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/65">
            The geometry of a handshake, where two hands meet and a new
            connection begins. Handshakes simply modernizes that ritual, so the
            introduction outlives the moment.
          </p>
        </div>

        <ul className="reveal flex flex-col justify-center divide-y divide-cream/10">
          {principles.map((p) => (
            <li key={p.title} className="grid gap-1 py-6 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
              <h3 className="font-display text-lg font-semibold text-cream">
                {p.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-cream/60">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
