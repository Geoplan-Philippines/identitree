import { Logo } from "@/components/shared/logo";

export function AuthShowcase() {
  return (
    <aside
      aria-hidden
      className="relative hidden overflow-hidden bg-forest-ink text-cream lg:flex"
    >
      {/* A single warm light source — restrained, no grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-[-10%] top-[6%] h-[560px] w-[560px] rounded-full bg-brass/[0.10] blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col p-12 xl:p-16">
        {/* Top: tagline — the credential card below carries the brand mark, so
            the panel leads with the value prop instead of repeating the logo. */}
        <div className="max-w-md">
          <h2 className="font-display text-[34px] font-semibold leading-[1.08] tracking-tight text-cream xl:text-[38px]">
            One tap.
            <br />
            <span className="text-cream/55">Your entire identity.</span>
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-cream/55">
            Replace business cards, badges, and access keys with a single NFC
            credential, designed for teams that take the ritual seriously.
          </p>
        </div>

        {/* Middle: floating credential card with NFC waves */}
        <div className="relative flex flex-1 items-center justify-center py-10">
          {/* Radiating NFC waves */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-brass/25" />
            <span
              className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-brass/15"
              style={{ animationDelay: "1s" }}
            />
            <span
              className="absolute h-44 w-44 animate-[nfc-pulse_3s_ease-out_infinite] rounded-full border border-brass/10"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Credential card */}
          <div className="relative w-full max-w-[420px] -rotate-[2.5deg]">
            {/* Soft glow under card */}
            <div className="absolute -inset-6 bg-brass opacity-15 blur-3xl" />

            <div className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-forest to-forest-ink p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-brass/15 blur-3xl" />

              {/* Card top row: mark + verified */}
              <div className="flex items-start justify-between">
                <Logo variant="ink" className="text-cream" markClassName="w-6" wordClassName="text-[13px]" />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brass">
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
              <div className="mt-9">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cream/40">
                  Credential holder
                </p>
                <p className="mt-1.5 font-display text-[20px] font-semibold tracking-tight text-cream">
                  Alex Morgan
                </p>
                <p className="text-[12px] text-cream/55">
                  Head of Design · Northwind Labs
                </p>
              </div>

              {/* Card bottom: brass NFC chip + serial */}
              <div className="mt-7 flex items-end justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative inline-flex h-7 w-9 items-center justify-center rounded-[5px] bg-gradient-to-br from-[#E6C583] to-brass">
                    <span className="block h-3 w-5 rounded-[2px] border border-brass-foreground/30" />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-cream/60"
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
                <p className="font-display text-[10px] tracking-[0.2em] text-cream/40">
                  HS · 0F8A · 4C2E
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
