"use client";

import { motion } from "motion/react";
import { Building2, Mail, Phone } from "lucide-react";
import { CardProps } from "./types";
import { cn } from "@/lib/utils";
import { getCardPattern } from "./card-patterns";


export function DefaultLayout({ profile, config, isFlipped }: CardProps) {
  const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);

  const logoAlign = config?.cardLogoAlignment || "right";
  const nameAlign = config?.cardNameAlignment || "left";
  const showPattern = config?.cardShowPattern !== false;
  const textColor = config?.cardTextColor;
  const pattern = getCardPattern(config?.cardPattern);
  const bgImage = config?.cardBackgroundImage;

  const getAlignClass = (align: string) => {
    if (align === "left") return "justify-start text-left items-start";
    if (align === "right") return "justify-end text-right items-end";
    return "justify-center text-center items-center";
  };

  const textStyle = textColor ? { color: textColor } : {};

  const frontBgStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    backgroundColor: config?.cardPrimaryColor || "transparent",
    ...(bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
  };

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[1.586/1] rounded-lg shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front Side */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-lg border border-foreground/10 p-6 text-foreground",
          !config?.cardPrimaryColor && !bgImage && "bg-[linear-gradient(135deg,#ffffff_0%,#f9fbfb_48%,#edf5f1_100%)]"
        )}
        style={{ ...frontBgStyle, ...textStyle }}
      >
        {/* Background overlay for image readability */}
        {bgImage && (
          <div className="absolute inset-0 bg-black/30" />
        )}

        {/* Pattern overlay */}
        {pattern && (
          <div className="absolute inset-0 pointer-events-none" style={pattern} />
        )}

        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />

        {/* Legacy geometric pattern (when cardShowPattern is true and no new pattern selected) */}
        {showPattern && !pattern && !bgImage && (
          <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-lg border border-foreground/10 bg-foreground/[0.035]" />
        )}

        {/* Logo / Org */}
        <div className={cn(
          "absolute inset-x-6 top-5 flex items-center gap-2 text-xs font-semibold z-10 min-w-0",
          logoAlign === "right" ? "justify-end" : logoAlign === "left" ? "justify-start" : "justify-center"
        )}>
          {logoAlign === "left" && profile.organization?.logo && (
            <span className="flex size-7 shrink-0 items-center justify-center">
              <img src={profile.organization.logo} alt="" className="max-h-full max-w-full" />
            </span>
          )}
          <span className="truncate max-w-[140px]" style={textStyle}>{profile.organization?.name || "Identitree"}</span>
          {logoAlign !== "left" && profile.organization?.logo && (
            <span className="flex size-7 shrink-0 items-center justify-center">
              <img src={profile.organization.logo} alt="" className="max-h-full max-w-full" />
            </span>
          )}
        </div>

        <div className={cn("relative flex h-full flex-col z-10 pt-8", nameAlign === "center" ? "justify-center" : "justify-between")}>
          <div className={cn("flex flex-col", getAlignClass(nameAlign))}>
            <p className="text-lg font-semibold leading-none break-words" style={textStyle}>
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-2 text-xs font-medium opacity-70" style={textStyle}>
              {profile.positionTitle}
            </p>
          </div>

          <div className={cn("grid gap-1.5 text-[0.65rem] font-medium opacity-70", getAlignClass(nameAlign))}>
            <span className="inline-flex items-center gap-1.5" style={textStyle}>
              <Phone className="size-3" aria-hidden="true" />
              {profile.contactNumber}
            </span>
            <span className="inline-flex items-center gap-1.5" style={textStyle}>
              <Mail className="size-3" aria-hidden="true" />
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden rounded-lg border border-white/10 p-6 text-white",
          !config?.cardSecondaryColor && "bg-[linear-gradient(135deg,#101312_0%,#191f1b_58%,#20372d_100%)]"
        )}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          backgroundColor: config?.cardSecondaryColor || "transparent"
        }}
      >
        {pattern && (
          <div className="absolute inset-0 pointer-events-none" style={pattern} />
        )}
        <div className="flex h-full items-center justify-between gap-5 relative z-10">
          <div className="min-w-0">
            <div className="mb-4 flex size-9 items-center justify-center rounded-md border border-white/15 bg-white/10">
              <Building2 className="size-4.5" aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold leading-tight">
              Connect with clarity.
            </p>
            <p className="mt-2 max-w-[12rem] text-[10px] leading-relaxed text-white/65">
              Digital identity powered by NFC technology.
            </p>
          </div>

          {config?.showQrCode !== false && (
            <div className="grid size-20 shrink-0 grid-cols-5 gap-1 rounded-md bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={qrCells.has(index) ? "rounded-[1.5px] bg-foreground" : "rounded-[1.5px] bg-transparent"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
