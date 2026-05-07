"use client";

import { motion } from "motion/react";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { CardProps } from "./types";

export function GlassLayout({ profile, config, isFlipped }: CardProps) {
  const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[1.586/1] rounded-lg shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 bg-white/20 p-6 text-white backdrop-blur-xl"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-lg border border-white/20 bg-white/10" />
        
        <div className="absolute right-6 top-6 text-xs font-bold tracking-widest uppercase opacity-70">
          {profile.organization?.name || "Identitree"}
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div className="pr-24 sm:pr-32">
            <p className="text-xl font-bold tracking-tight">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-1 text-xs font-medium opacity-70">
              {profile.positionTitle}
            </p>
          </div>

          <div className="grid gap-2 text-[0.72rem] font-bold">
            <span className="inline-flex items-center gap-2 opacity-80">
              <Phone className="size-3.5" />
              {profile.contactNumber}
            </span>
            <span className="inline-flex items-center gap-2 opacity-80">
              <Mail className="size-3.5" />
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 bg-white/10 p-6 text-white backdrop-blur-2xl"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="flex h-full items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/30 bg-white/10">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <p className="text-xl font-bold leading-tight">
              Glass ID.
            </p>
            <p className="mt-3 max-w-[14rem] text-xs leading-5 opacity-60">
              Elegance meets technology in your pocket.
            </p>
          </div>

          {config?.showQrCode !== false && (
            <div className="grid size-24 shrink-0 grid-cols-5 gap-1 rounded-xl bg-white/90 p-3 shadow-lg">
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
