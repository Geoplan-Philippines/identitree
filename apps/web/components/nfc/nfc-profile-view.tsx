"use client";

import { motion } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Nfc,
  Phone,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/lib/services/nfc-cards.service";

type NfcProfileViewProps = {
  profile: Profile;
  cardId: string;
};

type ContactAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export function NfcProfileView({ profile, cardId }: NfcProfileViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const contactActions: ContactAction[] = [
    {
      label: "WhatsApp",
      href: profile.whatsappNumber ? `https://wa.me/${profile.whatsappNumber}` : "#",
      icon: MessageCircle,
      external: true,
    },
    { label: "Call", href: `tel:${profile.contactNumber}`, icon: Phone },
    {
      label: "LinkedIn",
      href: profile.linkedinUsername ? `${profile.linkedinUsername}` : "#",
      icon: BriefcaseBusiness,
      external: true,
    },
    { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
  ];

  const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);

  function toggleCardFlip() {
    setIsFlipped((currentValue) => !currentValue);
  }

  function toggleCardFlipFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCardFlip();
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[560px] mx-auto p-4 bg-background">
      <Badge
        variant="outline"
        className="mb-5 h-7 rounded-none border-foreground/10 bg-background/70 px-3 text-muted-foreground shadow-sm backdrop-blur"
      >
        <Nfc className="size-3.5 mr-2" aria-hidden="true" />
        NFC profile
      </Badge>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <Avatar className="size-24 border border-white/80 bg-background shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-1 ring-foreground/10 rounded-none after:rounded-none">
          <AvatarImage src={profile.avatarUrl || ""} alt={fullName} className="rounded-none" />
          <AvatarFallback className="bg-foreground text-lg font-semibold text-background rounded-none">
            {initials}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="mt-6 text-center">
        <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl uppercase tracking-tight">
          {fullName}
        </h1>
        <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
          {profile.positionTitle}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-none border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Verified handoff
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-none border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm">
            <MapPin className="size-3.5" aria-hidden="true" />
            Identity Verified
          </span>
        </div>
      </div>

      <div className="mt-9 w-full">
        <motion.button
          type="button"
          aria-label="Flip digital business card"
          aria-pressed={isFlipped}
          onClick={toggleCardFlip}
          onKeyDown={toggleCardFlipFromKeyboard}
          whileTap={{ scale: 0.985 }}
          className="group block w-full rounded-none text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground/15"
          style={{ perspective: 1400 }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[1.586/1] rounded-none shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 overflow-hidden rounded-none border border-foreground/10 bg-[linear-gradient(135deg,#ffffff_0%,#f9fbfb_48%,#edf5f1_100%)] p-8 text-foreground"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
              <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-none border border-foreground/10 bg-foreground/[0.035]" />
              <div className="absolute right-6 top-6 flex items-center gap-2 text-xs font-semibold">
                <span className="flex size-7 items-center justify-center rounded-none bg-foreground text-background">
                  id
                </span>
              </div>

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="text-xl font-semibold leading-none text-foreground uppercase tracking-tight">
                    {fullName}
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

            {/* Back */}
            <div
              className="absolute inset-0 overflow-hidden rounded-none border border-white/10 bg-[linear-gradient(135deg,#101312_0%,#191f1b_58%,#20372d_100%)] p-8 text-white"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex h-full items-center justify-between gap-5">
                <div className="min-w-0">
                  <div className="mb-5 flex size-10 items-center justify-center rounded-none border border-white/15 bg-white/10">
                    <Building2 className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-xl font-semibold leading-tight uppercase tracking-tight">
                    Identitree Secure
                  </p>
                  <p className="mt-3 max-w-[14rem] text-[10px] leading-relaxed text-white/65 uppercase tracking-wide">
                    Digital identity verified and secured via NFC technology.
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[0.68rem] font-medium text-white/55">
                    <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
                    Ref {cardId.toUpperCase()}
                  </div>
                </div>

                <div className="grid size-24 shrink-0 grid-cols-5 gap-1 rounded-none bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <span
                      key={index}
                      className={qrCells.has(index) ? "bg-foreground" : "bg-transparent"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.button>

        <button
          type="button"
          onClick={toggleCardFlip}
          onKeyDown={toggleCardFlipFromKeyboard}
          className="mx-auto mt-4 flex items-center gap-2 rounded-none px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Tap to flip
        </button>
      </div>

      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 grid w-full max-w-[430px] grid-cols-4 gap-3"
      >
        {contactActions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noreferrer" : undefined}
            className="group flex flex-col items-center gap-2 rounded-none p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className="flex size-12 items-center justify-center rounded-none border border-border/70 bg-background/80 text-foreground shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-md">
              <action.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="max-w-full truncate text-xs font-medium text-muted-foreground uppercase tracking-tight">
              {action.label}
            </span>
          </a>
        ))}
      </motion.nav>
    </div>
  );
}
