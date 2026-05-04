"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Download,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
  Nfc,
  MessageCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyticsService, type AnalyticsChannel } from "@/lib/services/analytics.service";
import { Profile } from "@/lib/services/nfc-cards.service";

interface PublicProfileClientProps {
  profile: Profile;
}

type ContactAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export function PublicProfileClient({ profile }: PublicProfileClientProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasTrackedView = useRef(false);

  const getChannel = (): AnalyticsChannel => {
    if (typeof window === "undefined") return "DIRECT_LINK";
    const search = window.location.search.toLowerCase();
    if (search.includes("qr")) return "QR_SCAN";
    if (search.includes("nfc")) return "NFC_TAP";
    return "DIRECT_LINK";
  };

  useEffect(() => {
    if (profile?.id && !hasTrackedView.current) {
      hasTrackedView.current = true;
      analyticsService.trackEvent({
        profileId: profile.id,
        eventType: "PROFILE_VIEW",
        channel: getChannel(),
      }).catch(console.error);
    }
  }, [profile?.id]);

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  const contactActions: ContactAction[] = [
    {
      label: "WhatsApp",
      href: (() => {
        let num = profile.whatsappNumber || profile.contactNumber;
        if (!num) return "#";
        num = num.replace(/\D/g, "");
        if (num.startsWith("0")) num = "63" + num.substring(1);
        return `https://wa.me/${num}`;
      })(),
      icon: MessageCircle,
      external: true,
    },
    { 
      label: "Viber", 
      href: profile.viberNumber ? `viber://contact?number=${profile.viberNumber.replace(/\D/g, "")}` : `viber://contact?number=${profile.contactNumber.replace(/\D/g, "")}`, 
      icon: Phone,
      external: true
    },
    {
      label: "LinkedIn",
      href: profile.linkedinUsername ? (profile.linkedinUsername.startsWith("http") ? profile.linkedinUsername : `https://linkedin.com/in/${profile.linkedinUsername}`) : "#",
      icon: BriefcaseBusiness,
      external: true,
    },
    { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
  ].filter(action => action.href !== "#" && !action.href.endsWith("null"));

  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.firstName} ${profile.lastName}`,
    `ORG:${profile.organization?.name || "Identitree"}`,
    `TITLE:${profile.positionTitle}`,
    `TEL;TYPE=CELL:${profile.contactNumber}`,
    `TEL;TYPE=Viber:${profile.viberNumber || profile.contactNumber}`,
    `item1.TEL:${profile.viberNumber || profile.contactNumber}`,
    `item1.X-ABLabel:Viber`,
    `item2.URL:viber://contact?number=${(profile.viberNumber || profile.contactNumber).replace(/\D/g, "")}`,
    `item2.X-ABLabel:Viber Link`,
    `EMAIL:${profile.email}`,
    "END:VCARD",
  ].join("\n");

  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;
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
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-svh w-full max-w-[560px] flex-col items-center px-5 py-8 sm:px-6 sm:py-12"
    >
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Badge
          variant="outline"
          className="mb-5 h-7 rounded-md border-foreground/10 bg-background/70 px-3 text-muted-foreground shadow-sm backdrop-blur"
        >
          <Nfc className="size-3.5" aria-hidden="true" />
          NFC profile
        </Badge>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <Avatar className="size-24 border border-white/80 bg-background shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-1 ring-foreground/10">
            <AvatarImage src={profile.avatarUrl || ""} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="bg-foreground text-lg font-semibold text-background">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
            {profile.positionTitle} {profile.organization?.name && `at ${profile.organization.name}`}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Verified handoff
            </span>
          </div>
        </div>

        <div className="mt-9 w-full max-w-[430px]">
          <motion.button
            type="button"
            aria-label="Flip digital business card"
            aria-pressed={isFlipped}
            onClick={toggleCardFlip}
            onKeyDown={toggleCardFlipFromKeyboard}
            whileTap={{ scale: 0.985 }}
            className="group block w-full rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground/15"
            style={{ perspective: 1400 }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[1.586/1] rounded-lg shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-lg border border-foreground/10 bg-[linear-gradient(135deg,#ffffff_0%,#f9fbfb_48%,#edf5f1_100%)] p-6 text-foreground"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
                <div className="absolute -right-12 -bottom-8 h-24 w-40 rotate-12 rounded-lg border border-foreground/10 bg-foreground/[0.035]" />
                <div className="absolute right-6 top-6 flex items-center gap-2 text-xs font-semibold">
                  <span>{profile.organization?.name || "Identitree"}</span>
                  <span className="flex size-7 items-center justify-center">
                    <img src={profile.organization?.logo} alt="" />
                  </span>
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
                </div>
              </div>
            </motion.div>
          </motion.button>

          <button
            type="button"
            onClick={toggleCardFlip}
            onKeyDown={toggleCardFlipFromKeyboard}
            className="mx-auto mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Tap to flip
          </button>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Contact actions"
          className="mt-7 flex flex-wrap items-start justify-center w-full max-w-[430px] gap-6"
        >
          {contactActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              aria-label={action.label}
              className="group flex min-w-0 flex-col items-center gap-2 rounded-md p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-md">
                <action.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="max-w-full truncate text-xs font-medium text-muted-foreground">
                {action.label}
              </span>
            </a>
          ))}
        </motion.nav>

        <div className="mt-7 w-full max-w-[430px] space-y-3">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-md shadow-[0_16px_35px_rgba(15,23,42,0.14)]"
          >
            <a 
              href={vCardHref} 
              download={`${profile.firstName}-${profile.lastName}.vcf`}
              onClick={() => {
                analyticsService.trackEvent({
                  profileId: profile.id,
                  eventType: "SAVE_CONTACT",
                  channel: getChannel(),
                }).catch(console.error);
              }}
            >
              <Download className="size-4" aria-hidden="true" />
              Save Contact
            </a>
          </Button>

          <a
            href={profile.organization?.website || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-border/70 bg-background/65 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Visit company
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <footer className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Powered by Identitree</span>
      </footer>
    </motion.section>
  );
}
