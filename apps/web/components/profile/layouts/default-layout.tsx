"use client";

import { motion } from "motion/react";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { CardProps } from "./types";

export function DefaultLayout({ profile, config, isFlipped }: CardProps) {
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
        className="absolute inset-0 overflow-hidden rounded-lg border border-foreground/10 bg-[linear-gradient(135deg,#ffffff_0%,#f9fbfb_48%,#edf5f1_100%)] p-6 text-foreground"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-lg border border-foreground/10 bg-foreground/[0.035]" />
        <div className="absolute right-6 top-6 flex items-center gap-2 text-xs font-semibold">
          <span>{profile.organization?.name || "Identitree"}</span>
          {profile.organization?.logo && (
            <span className="flex size-7 items-center justify-center">
              <img src={profile.organization.logo} alt="" className="max-h-full max-w-full" />
            </span>
          )}
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div className="pr-24 sm:pr-32">
            <p className="text-lg font-semibold leading-none text-foreground break-words">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {profile.positionTitle}
            </p>
          </div>

          <div className="grid gap-2 text-[0.72rem] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-3.5" aria-hidden="true" />
              {profile.contactNumber}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-3.5" aria-hidden="true" />
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#101312_0%,#191f1b_58%,#20372d_100%)] p-6 text-white"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <div className="flex h-full items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="mb-5 flex size-10 items-center justify-center rounded-md border border-white/15 bg-white/10">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <p className="text-xl font-semibold leading-tight">
              Connect with clarity.
            </p>
            <p className="mt-3 max-w-[14rem] text-xs leading-5 text-white/65">
              Digital identity powered by NFC technology.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[0.68rem] font-medium text-white/55">
              <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
              Ref {profile.id.substring(0, 8).toUpperCase()}
            </div>
          </div>

          {config?.showQrCode !== false && (
            <div className="grid size-24 shrink-0 grid-cols-5 gap-1 rounded-md bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    qrCells.has(index)
                      ? "rounded-[2px] bg-foreground"
                      : "rounded-[2px] bg-transparent"
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
