
"use client";

import { use, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Download,
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
import { Button } from "@/components/ui/button";

type NfcCardPageProps = {
  params: Promise<{ id: string }>;
};

type ContactAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const profile = {
  name: "Elena Morgan",
  initials: "EM",
  title: "Founder & Managing Partner",
  company: "Northstar Ventures",
  phone: "+1 415 555 0188",
  email: "elena@northstar.ventures",
  location: "San Francisco, CA",
  website: "northstar.ventures",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
};

const contactActions: ContactAction[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/14155550188",
    icon: MessageCircle,
    external: true,
  },
  { label: "Call", href: "tel:+14155550188", icon: Phone },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: BriefcaseBusiness,
    external: true,
  },
  { label: "Email", href: "mailto:elena@northstar.ventures", icon: Mail },
];

const vCard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Morgan;Elena;;;",
  "FN:Elena Morgan",
  "ORG:Northstar Ventures",
  "TITLE:Founder & Managing Partner",
  "TEL;TYPE=CELL:+14155550188",
  "EMAIL:elena@northstar.ventures",
  "URL:https://northstar.ventures",
  "ADR;TYPE=WORK:;;One Market Street;San Francisco;CA;94105;USA",
  "END:VCARD",
].join("\n");

const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;
const qrCells = new Set([0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 23, 24]);

export default function NfcCardPage({ params }: NfcCardPageProps) {
  const { id } = use(params);
  const [isFlipped, setIsFlipped] = useState(false);

  function toggleCardFlip() {
    setIsFlipped((currentValue) => !currentValue);
  }

  function toggleCardFlipFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleCardFlip();
  }

  return (
    <main className="relative bg-red-700 isolate min-h-svh overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfa_44%,#eef6f2_100%)] text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[48px_48px] mask-[linear-gradient(to_bottom,black,transparent_74%)]"
      />

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
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-foreground text-lg font-semibold text-background">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="mt-6 text-center">
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
              {profile.title} at {profile.company}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Verified handoff
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5 shadow-sm">
                <MapPin className="size-3.5" aria-hidden="true" />
                {profile.location}
              </span>
            </div>
          </div>

          <div className="mt-9 w-full max-w-107.5">
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
                    <span>{profile.company}</span>
                    <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
                      id
                    </span>
                  </div>

                  <div className="relative flex h-full flex-col justify-between">
                    <div>
                      <p className="text-lg font-semibold leading-none text-foreground">
                        {profile.name}
                      </p>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {profile.title}
                      </p>
                    </div>

                    <div className="grid gap-2 text-[0.72rem] font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Phone className="size-3.5" aria-hidden="true" />
                        {profile.phone}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Mail className="size-3.5" aria-hidden="true" />
                        {profile.email}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Globe2 className="size-3.5" aria-hidden="true" />
                        {profile.website}
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
                        Partnerships, board advisory, and early-stage capital.
                      </p>
                      <div className="mt-5 flex items-center gap-2 text-[0.68rem] font-medium text-white/55">
                        <BriefcaseBusiness className="size-3.5" aria-hidden="true" />
                        Ref {id.toUpperCase()}
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
            className="mt-7 grid w-full max-w-[430px] grid-cols-4 gap-3"
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
              <a href={vCardHref} download="elena-morgan.vcf">
                <Download className="size-4" aria-hidden="true" />
                Save Contact
              </a>
            </Button>

            <a
              href="https://northstar.ventures"
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
    </main>
  );
}
