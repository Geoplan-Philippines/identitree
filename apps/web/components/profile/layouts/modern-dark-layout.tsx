"use client";

import { motion } from "motion/react";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { CardProps } from "./types";

export function ModernDarkLayout({ profile, config, isFlipped }: CardProps) {
  const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);
  const primaryColor = config?.primaryColor || "#3b82f6"; // blue-500

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[1.586/1] rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-6 text-white"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-lg border border-white/5 bg-white/[0.02]" />
        
        <div className="absolute right-6 top-6 flex items-center gap-2 text-xs font-semibold text-blue-400">
          <span>{profile.organization?.name || "Identitree"}</span>
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div className="pr-24 sm:pr-32">
            <p className="text-lg font-semibold leading-none tracking-tight">
              {profile.firstName} <span style={{ color: primaryColor }}>{profile.lastName}</span>
            </p>
            <p className="mt-2 text-xs font-medium text-zinc-500">
              {profile.positionTitle}
            </p>
          </div>

          <div className="grid gap-2 text-[0.72rem] font-medium text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-3.5" style={{ color: primaryColor }} />
              {profile.contactNumber}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-3.5" style={{ color: primaryColor }} />
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-6 text-white"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="flex h-full items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-5 flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/5">
              <Building2 className="size-5 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-xl font-semibold leading-tight">
              Modern ID.
            </p>
            <p className="mt-3 max-w-[14rem] text-xs leading-5 text-zinc-500">
              Tap to connect instantly with my digital profile.
            </p>
          </div>

          {config?.showQrCode !== false && (
            <div className="grid size-24 shrink-0 grid-cols-5 gap-1 rounded-md bg-white p-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    qrCells.has(index)
                      ? "rounded-[1px] bg-black"
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
