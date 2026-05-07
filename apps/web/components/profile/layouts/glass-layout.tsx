"use client";

import { motion } from "motion/react";
import { Building2, Mail, Phone } from "lucide-react";
import { CardProps } from "./types";
import { cn } from "@/lib/utils";
import { getCardPattern } from "./card-patterns";

export function GlassLayout({ profile, config, isFlipped }: CardProps) {
  const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);

  const logoAlign = config?.cardLogoAlignment || "right";
  const nameAlign = config?.cardNameAlignment || "left";
  const showPattern = config?.cardShowPattern !== false;
  const textColor = config?.cardTextColor || "#f1f5f9";
  const pattern = getCardPattern(config?.cardPattern);
  const bgImage = config?.cardBackgroundImage;

  const getAlignClass = (align: string) => {
    if (align === "left") return "justify-start text-left items-start";
    if (align === "right") return "justify-end text-right items-end";
    return "justify-center text-center items-center";
  };

  const ts = { color: textColor };

  // Default frosted look: rich slate gradient
  const frontBg = config?.cardPrimaryColor || "#334155";
  const backBg = config?.cardSecondaryColor || "#1e293b";

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[1.586/1] rounded-xl shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-xl border border-white/20 p-6"
        style={{
          backfaceVisibility: "hidden",
          background: frontBg,
          ...(bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
        }}
      >
        {bgImage && <div className="absolute inset-0 bg-black/40" />}
        {/* Frosted shimmer overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        {pattern && (
          <div className="absolute inset-0 pointer-events-none" style={pattern} />
        )}
        {showPattern && !pattern && (
          <>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
          </>
        )}

        {/* Logo / Org */}
        <div className={cn(
          "absolute inset-x-6 top-6 flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase",
          logoAlign === "right" ? "justify-end" : logoAlign === "left" ? "justify-start" : "justify-center"
        )}>
          {logoAlign === "left" && profile.organization?.logo && (
            <span className="flex size-6 items-center justify-center">
              <img src={profile.organization.logo} alt="" className="max-h-full max-w-full" />
            </span>
          )}
          <span style={{ ...ts, opacity: 0.75 }}>{profile.organization?.name || "Identitree"}</span>
          {logoAlign !== "left" && profile.organization?.logo && (
            <span className="flex size-6 items-center justify-center">
              <img src={profile.organization.logo} alt="" className="max-h-full max-w-full" />
            </span>
          )}
        </div>

        <div className={cn("relative flex h-full flex-col", nameAlign === "center" ? "justify-center pt-6" : "justify-between")}>
          <div className={cn("flex flex-col", getAlignClass(nameAlign))}>
            <p className="text-xl font-bold tracking-tight" style={ts}>
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-1.5 text-[10px] font-medium" style={{ color: textColor, opacity: 0.65 }}>
              {profile.positionTitle}
            </p>
          </div>

          <div className={cn("grid gap-1.5 text-[0.65rem] font-medium", getAlignClass(nameAlign))}>
            <span className="inline-flex items-center gap-2" style={{ color: textColor, opacity: 0.75 }}>
              <Phone className="size-3" />
              {profile.contactNumber}
            </span>
            <span className="inline-flex items-center gap-2" style={{ color: textColor, opacity: 0.75 }}>
              <Mail className="size-3" />
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-xl border border-white/20 p-6"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: backBg,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="flex h-full items-center justify-between gap-5 relative">
          <div className="min-w-0">
            <div className="mb-4 flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/10">
              <Building2 className="size-4.5 text-white/80" aria-hidden="true" />
            </div>
            <p className="text-lg font-bold leading-tight text-white">
              Glass ID.
            </p>
            <p className="mt-2 max-w-[12rem] text-[10px] leading-relaxed text-white/55">
              Elegance meets technology in your pocket.
            </p>
          </div>

          {config?.showQrCode !== false && (
            <div className="grid size-20 shrink-0 grid-cols-5 gap-1 rounded-lg bg-white/90 p-2 shadow-lg">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    qrCells.has(index)
                      ? "rounded-[1px] bg-slate-900"
                      : "rounded-[1px] bg-transparent"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
