export function AuthShowcase() {
  return (
    <aside
      aria-hidden
      className="relative hidden overflow-hidden bg-[oklch(0.16_0.02_260)] text-white lg:flex"
    >
      {/* Ambient gradient washes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[oklch(0.55_0.20_258)] opacity-30 blur-[120px]" />
        <div className="absolute -bottom-40 -right-24 h-[560px] w-[560px] rounded-full bg-[oklch(0.45_0.18_280)] opacity-25 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.70_0.18_252)] opacity-15 blur-[100px]" />
      </div>

      {/* Fine grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col p-12 xl:p-16">
        {/* Top: eyebrow + tagline */}
        <div className="max-w-md">
          <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-6 bg-white/40" />
            Identitree Platform
          </p>
          <h2 className="text-[34px] font-semibold leading-[1.1] tracking-tight text-white xl:text-[38px]">
            One tap.
            <br />
            <span className="text-white/55">Your entire identity.</span>
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/55">
            Replace business cards, badges, and access keys with a single NFC
            credential — designed for teams that take identity seriously.
          </p>
        </div>

        {/* Middle: floating credential card with NFC waves */}
        <div className="relative flex flex-1 items-center justify-center py-10">
          {/* Radiating NFC waves */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-white/15" />
            <span
              className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-white/10"
              style={{ animationDelay: "1s" }}
            />
            <span
              className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-white/5"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Credential card */}
          <div className="relative w-full max-w-[420px] -rotate-[2.5deg]">
            {/* Soft glow under card */}
            <div className="absolute -inset-6 bg-[oklch(0.55_0.20_258)] opacity-30 blur-3xl" />

            <div className="relative aspect-[1.586/1] w-full overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-7 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
              {/* Card top row: logo + verified */}
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center bg-white text-[oklch(0.16_0.02_260)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21V11" />
                      <path d="M12 11c0-3.5 2.5-6 6-6" />
                      <path d="M12 14c0-3.5-2.5-6-6-6" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    Identitree
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-emerald-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-2.5 w-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              </div>

              {/* Card identity */}
              <div className="mt-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Credential holder
                </p>
                <p className="mt-1.5 text-[19px] font-semibold tracking-tight text-white">
                  Alex Morgan
                </p>
                <p className="text-[12px] text-white/55">
                  Head of Design · Northwind Labs
                </p>
              </div>

              {/* Card bottom: NFC chip + serial */}
              <div className="mt-7 flex items-end justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative inline-flex h-7 w-9 items-center justify-center border border-white/20 bg-gradient-to-br from-amber-200/80 to-amber-500/60">
                    <span className="block h-3 w-5 border-x border-amber-900/40" />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  >
                    <path d="M4 8c4 0 8 4 8 8" />
                    <path d="M4 13c2 0 3 1 3 3" />
                    <path d="M4 18h.01" />
                  </svg>
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/40">
                  IDT · 0F8A · 4C2E
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes nfc-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>
    </aside>
  );
}
