"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
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
  MessageCircle,
  Nfc,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/lib/services/analytics.service";
import { Profile, TemplateConfig } from "@/lib/services/nfc-cards.service";
import { getAnalyticsChannel } from "@/lib/utils/analytics-utils";
import { renderProfileCard } from "./layouts/layouts-registry";

interface PublicProfileClientProps {
  profile: Profile;
}

export function PublicProfileClient({ profile }: PublicProfileClientProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (profile?.id && !hasTrackedView.current) {
      hasTrackedView.current = true;
      analyticsService.trackEvent({
        profileId: profile.id,
        eventType: "PROFILE_VIEW",
        channel: getAnalyticsChannel(),
      }).catch(console.error);
    }
  }, [profile?.id]);

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  const contactActions = [
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
    `EMAIL:${profile.email}`,
    "END:VCARD",
  ].join("\n");

  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;

  function toggleCardFlip() {
    setIsFlipped((currentValue) => !currentValue);
  }

  function toggleCardFlipFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCardFlip();
  }

  const templateConfig = profile.template?.config as TemplateConfig | undefined;

  // Use state for layout to avoid hydration mismatch
  const [activeLayout, setActiveLayout] = useState(profile.template?.layoutKey || "default");

  useEffect(() => {
    // Only check for URL overrides after hydration
    const layoutOverride = new URLSearchParams(window.location.search).get("layout");
    if (layoutOverride && layoutOverride !== activeLayout) {
      setActiveLayout(layoutOverride);
    }
  }, [activeLayout]);

  const layoutKey = activeLayout;

  // Theme definitions
  const themes = {
    default: {
      bg: "bg-[#f8fafc] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]",
      text: "text-foreground",
      subtext: "text-muted-foreground",
      badge: "border-foreground/10 bg-background/70 text-muted-foreground",
      avatar: "border-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-foreground/10",
      button: "shadow-[0_16px_35px_rgba(15,23,42,0.14)]",
      secondaryButton: "border-border/70 bg-background/65 hover:bg-background text-foreground",
      footer: "text-muted-foreground"
    },
    "modern-dark": {
      bg: "bg-[#09090b]",
      text: "text-white",
      subtext: "text-zinc-400",
      badge: "border-white/10 bg-white/5 text-blue-400",
      avatar: "border-white/10 p-1 ring-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]",
      button: "shadow-[0_10px_30px_rgba(59,130,246,0.3)]",
      secondaryButton: "border-white/10 bg-white/5 text-white hover:bg-white/10",
      footer: "text-zinc-600"
    },
    glass: {
      bg: "bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]",
      text: "text-white",
      subtext: "text-slate-400",
      badge: "border-white/10 bg-white/5 text-blue-400 backdrop-blur-md",
      avatar: "border-white/10 ring-white/5 shadow-2xl",
      button: "bg-blue-600 hover:bg-blue-700 text-white border-none shadow-xl",
      secondaryButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
      footer: "text-slate-600"
    }
  };

  const theme = themes[layoutKey as keyof typeof themes] || themes.default;
  const primaryColor = templateConfig?.primaryColor || (layoutKey === "modern-dark" ? "#3b82f6" : "#0f172a");

  // Custom background color from config if available (only for default layout)
  const customBg = layoutKey === "default" && templateConfig?.backgroundColor ? { backgroundColor: templateConfig.backgroundColor } : {};

  return (
    <div
      className={`min-h-svh w-full transition-all duration-500 ${theme.bg}`}
      style={customBg}
    >
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-[560px] flex-col items-center px-5 py-8 sm:px-6 sm:py-12"
      >
        <Badge
          variant="outline"
          className={`mb-5 h-7 rounded-md px-3 shadow-sm backdrop-blur transition-all duration-500 ${theme.badge}`}
        >
          <Nfc className="size-3.5" aria-hidden="true" />
          NFC profile
        </Badge>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <Avatar className={`size-24 border bg-background ring-1 transition-all duration-500 ${theme.avatar}`}>
            <AvatarImage src={profile.avatarUrl || ""} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="bg-foreground text-lg font-semibold text-background" style={{ backgroundColor: primaryColor }}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="mt-6 text-center">
          <h1 className={`text-4xl font-semibold leading-tight sm:text-5xl transition-colors duration-500 ${theme.text}`}>
            {profile.firstName} {profile.lastName}
          </h1>
          <p className={`mt-3 text-sm font-medium sm:text-base transition-colors duration-500 ${theme.subtext}`}>
            {profile.positionTitle} {profile.organization?.name && `at ${profile.organization.name}`}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 shadow-sm backdrop-blur transition-all duration-500 ${theme.badge}`}>
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
            {renderProfileCard(profile, isFlipped, layoutKey)}
          </motion.button>

          <button
            type="button"
            onClick={toggleCardFlip}
            onKeyDown={toggleCardFlipFromKeyboard}
            className={`mx-auto mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none ${theme.subtext} hover:${theme.text}`}
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
              <span className={`flex size-12 items-center justify-center rounded-full border shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md ${theme.secondaryButton}`}>
                <action.icon className="size-5" aria-hidden="true" />
              </span>
              <span className={`max-w-full truncate text-xs font-medium transition-colors duration-500 ${theme.subtext}`}>
                {action.label}
              </span>
            </a>
          ))}
        </motion.nav>

        <div className="mt-7 w-full max-w-[430px] space-y-3">
          <Button
            asChild
            size="lg"
            className={`h-12 w-full rounded-md transition-all duration-500 ${theme.button}`}
            style={{ backgroundColor: primaryColor }}
          >
            <a
              href={vCardHref}
              download={`${profile.firstName}-${profile.lastName}.vcf`}
              onClick={() => {
                analyticsService.trackEvent({
                  profileId: profile.id,
                  eventType: "SAVE_CONTACT",
                  channel: getAnalyticsChannel(),
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
            className={`flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium shadow-sm backdrop-blur transition-all duration-500 ${theme.secondaryButton}`}
          >
            Visit company
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <footer className={`mt-10 flex items-center justify-center gap-2 text-xs transition-colors duration-500 ${theme.footer}`}>
          <span>Powered by Identitree</span>
        </footer>
      </motion.section>
    </div>
  );
}
