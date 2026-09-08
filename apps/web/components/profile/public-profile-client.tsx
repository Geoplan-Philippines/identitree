"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
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
import { getPagePattern } from "./layouts/card-patterns";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

interface PublicProfileClientProps {
  profile: Profile;
}

export function PublicProfileClient({ profile }: PublicProfileClientProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasTrackedView = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (profile?.id && !hasTrackedView.current) {
      hasTrackedView.current = true;
      
      // Get source from URL params
      const ref = searchParams.get("ref");
      const source = ref === "nfc_tap" ? "nfc_tap" : ref === "qr" ? "qr_code" : "direct";

      // Existing internal analytics
      analyticsService.trackEvent({
        profileId: profile.id,
        eventType: "PROFILE_VIEW",
        channel: getAnalyticsChannel(),
      }).catch(console.error);

      // PostHog Tracking
      posthog.capture("profile_viewed", {
        profileId: profile.id,
        profileName: `${profile.firstName} ${profile.lastName}`,
        organization: profile.organization?.name,
        source: source,
      });
    }
  }, [profile?.id, profile.firstName, profile.lastName, profile.organization?.name, searchParams]);

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  const config = profile.template?.config as TemplateConfig | undefined;
  const layoutKey = config?.cardLayoutKey || profile.template?.layoutKey || "default";
  const hasConfig = !!profile.template; // If it has a template, it has a "config" even if empty

  const [isNfcTap, setIsNfcTap] = useState(false);
  useEffect(() => {
    setIsNfcTap(searchParams.get("ref") === "nfc_tap" || profile.id.startsWith("tpl_preview_"));
  }, [profile.id, searchParams]);

  useEffect(() => {
    const font = config?.fontFamily;
    if (!font || font === "inherit") return;

    // Preconnect once so the user-selected webfont resolves without an extra
    // round-trip. Paired with display=swap below to avoid layout shift.
    const preconnects: [string, boolean][] = [
      ["https://fonts.googleapis.com", false],
      ["https://fonts.gstatic.com", true],
    ];
    for (const [href, crossOrigin] of preconnects) {
      const pcId = `preconnect-${href.replace(/[^a-z]/gi, "")}`;
      if (!document.getElementById(pcId)) {
        const pc = document.createElement("link");
        pc.id = pcId;
        pc.rel = "preconnect";
        pc.href = href;
        if (crossOrigin) pc.crossOrigin = "anonymous";
        document.head.appendChild(pc);
      }
    }

    const id = `font-${font.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }, [config?.fontFamily]);

  const StatusDot = () => (
    <span className="mr-1.5 inline-block size-1.5 rounded-full bg-brass" aria-hidden="true" />
  );

  // ─── Contact actions (shared) ───
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
      href: profile.viberNumber
        ? `viber://contact?number=${profile.viberNumber.replace(/\D/g, "")}`
        : `viber://contact?number=${profile.contactNumber.replace(/\D/g, "")}`,
      icon: Phone,
      external: true,
    },
    {
      label: "LinkedIn",
      href: profile.linkedinUsername
        ? profile.linkedinUsername.startsWith("http") ? profile.linkedinUsername : `https://linkedin.com/in/${profile.linkedinUsername}`
        : "#",
      icon: BriefcaseBusiness,
      external: true,
    },
    { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
  ].filter((a) => a.href !== "#" && !a.href.endsWith("null"));

  // ─── vCard (shared) ───
  const vCard = [
    "BEGIN:VCARD", "VERSION:3.0",
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.firstName} ${profile.lastName}`,
    `ORG:${profile.organization?.name || "Handshakes"}`,
    `TITLE:${profile.positionTitle}`,
    `TEL;TYPE=CELL:${profile.contactNumber}`,
    `TEL;TYPE=Viber:${profile.viberNumber || profile.contactNumber}`,
    `EMAIL:${profile.email}`,
    "END:VCARD",
  ].join("\n");
  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;

  function toggleCardFlip() { setIsFlipped((v) => !v); }
  function toggleCardFlipFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCardFlip();
  }

  // ─── Config-derived values (only used when hasConfig) ───
  const primaryColor = config?.primaryColor || (layoutKey === "default" ? "var(--forest-ink)" : "var(--forest)");
  const accentColor = config?.accentColor || (layoutKey === "default" ? primaryColor : "var(--brass)");
  const textColor = config?.textColor || (layoutKey === "default" ? "var(--forest-ink)" : "var(--cream)");

  const buttonRadius = { sharp: "rounded-lg", rounded: "rounded-2xl", pill: "rounded-full" }[config?.buttonStyle || "sharp"];
  const avatarRadius = { square: "rounded-lg", circle: "rounded-full", rounded: "rounded-2xl" }[config?.avatarStyle || "circle"];
  const glassStyle = config?.glassmorphism || layoutKey === "glass" ? "backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl" : "";
  const spacingClass = { compact: "py-4 sm:py-6 gap-4", relaxed: "py-8 sm:py-12 gap-8", loose: "py-12 sm:py-20 gap-12" }[config?.contentSpacing || "relaxed"];

  const primaryBtnBg = config?.primaryButtonColor || primaryColor;
  const primaryBtnText = config?.primaryButtonTextColor || "#ffffff";
  const secondaryBtnColor = config?.secondaryButtonColor || primaryColor;
  const secondaryBtnText = config?.secondaryButtonTextColor || primaryColor;
  const primaryBtnLabel = config?.primaryButtonLabel || "Save Contact";
  const secondaryBtnLabel = config?.secondaryButtonLabel || "Visit company";

  const bgType = config?.backgroundType;
  const backgroundStyle: React.CSSProperties = {};
  if (bgType === "solid" && config?.backgroundColor) backgroundStyle.backgroundColor = config.backgroundColor;
  else if (bgType === "gradient" && config?.backgroundGradient) backgroundStyle.background = config.backgroundGradient;
  else if (bgType === "image" && config?.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${config.backgroundImage})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  }
  const useThemeBg = !bgType || (bgType === "solid" && !config?.backgroundColor);
  const pagePattern = (!bgType || bgType === "solid") ? getPagePattern(config?.pagePattern) : null;

  const themes = {
    // Everyday product surface — warm paper, forest ink, brass accent.
    default: { bg: "bg-paper", text: "text-forest-ink", subtext: "text-forest-ink/60", badge: "border-forest-ink/10 bg-cream/70 text-forest-ink/70", avatar: "border-cream shadow-[0_18px_45px_rgba(13,42,31,0.16)] ring-forest-ink/10", button: "shadow-sm", secondaryButton: "border-forest-ink/70 bg-transparent text-forest-ink", footer: "text-forest-ink/50" },
    // Premium forest chrome — forest ink ground, cream text, brass accent.
    "modern-dark": { bg: "bg-forest-ink", text: "text-cream", subtext: "text-cream/55", badge: "border-brass/30 bg-brass/10 text-brass", avatar: "border-cream/10 p-1 ring-cream/5 shadow-2xl", button: "shadow-xl", secondaryButton: "border-cream/15 bg-cream/5 text-cream", footer: "text-cream/40" },
    // Frosted glass over forest — warm brass glow, no purple.
    glass: { bg: "bg-forest-ink bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(198,160,90,0.12),rgba(255,255,255,0))]", text: "text-cream", subtext: "text-cream/55", badge: "border-cream/10 bg-cream/5 text-brass backdrop-blur-md", avatar: "border-cream/10 ring-cream/5 shadow-2xl", button: "shadow-xl", secondaryButton: "bg-cream/5 border-cream/10 text-cream", footer: "text-cream/40" },
  };
  const theme = themes[layoutKey as keyof typeof themes] || themes.default;

  const getAlignmentClass = (a?: string) => a === "left" ? "items-start text-left" : a === "right" ? "items-end text-right" : "items-center text-center";
  const getJustifyClass = (a?: string) => a === "left" ? "justify-start" : a === "right" ? "justify-end" : "justify-center";

  // ════════════════════════════════════════════════════════════
  // DEFAULT VIEW — no template config
  // ════════════════════════════════════════════════════════════
  if (!hasConfig) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex min-h-svh w-full max-w-[560px] flex-col items-center px-5 py-8 sm:px-6 sm:py-12"
      >
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <Badge variant="outline" className="mb-5 h-7 rounded-full border-foreground/10 bg-background/70 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur">
            <StatusDot />
            Digital Business Card
          </Badge>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
            <Avatar className="size-24 border border-cream bg-background shadow-[0_18px_45px_rgba(13,42,31,0.16)] ring-1 ring-forest-ink/10">
              <AvatarImage src={profile.avatarUrl || ""} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="bg-foreground text-lg font-semibold text-background">{initials}</AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="mt-6 text-center">
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{profile.firstName} {profile.lastName}</h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">{profile.positionTitle} {profile.organization?.name && `at ${profile.organization.name}`}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all duration-500",
                  "border-border/70 bg-background/70 text-muted-foreground"
                )}>
                  <ShieldCheck className="size-3.5 text-brass" aria-hidden="true" />
                  Verified Identity
                </span>
            </div>
          </div>

          <div className="mt-9 w-full max-w-[430px]">
            <motion.button type="button" aria-label="Flip digital business card" aria-pressed={isFlipped} onClick={toggleCardFlip} onKeyDown={toggleCardFlipFromKeyboard} whileTap={{ scale: 0.985 }} className="group block w-full rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground/15" style={{ perspective: 1400 }}>
              {renderProfileCard(profile, isFlipped, "default")}
            </motion.button>
            <button type="button" onClick={toggleCardFlip} onKeyDown={toggleCardFlipFromKeyboard} className="mx-auto mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Tap to flip
            </button>
          </div>

          <motion.nav initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.42, ease: [0.22, 1, 0.36, 1] }} aria-label="Contact actions" className="mt-7 flex flex-wrap items-start justify-center w-full max-w-[430px] gap-6">
            {contactActions.map((action) => (
              <a key={action.label} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined} aria-label={action.label} className="group flex min-w-0 flex-col items-center gap-2 rounded-md p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                <span className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-md">
                  <action.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="max-w-full truncate text-xs font-medium text-muted-foreground">{action.label}</span>
              </a>
            ))}
          </motion.nav>

          <div className="mt-7 w-full max-w-[430px] space-y-3">
            <Button asChild size="lg" className="h-11 w-full rounded-md shadow-sm">
              <a 
                href={vCardHref} 
                download={`${profile.firstName}-${profile.lastName}.vcf`} 
                onClick={() => { 
                  analyticsService.trackEvent({ profileId: profile.id, eventType: "SAVE_CONTACT", channel: getAnalyticsChannel() }).catch(console.error); 
                  posthog.capture("contact_saved", {
                    profileId: profile.id,
                    profileName: `${profile.firstName} ${profile.lastName}`,
                  });
                }}
              >
                <Download className="size-4" aria-hidden="true" />
                Save Contact
              </a>
            </Button>
            <a href={profile.organization?.website || "#"} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-md border border-border/70 bg-background/65 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none">
              Visit company
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <footer className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Powered by Handshakes</span>
        </footer>
      </motion.section>
    );
  }

  // ════════════════════════════════════════════════════════════
  // CONFIGURED VIEW — template config drives everything
  // ════════════════════════════════════════════════════════════
  const sectionsOrder = config?.sectionsOrder || ["avatar", "header", "bio", "socials", "actions", "footer"];

  const renderSection = (sectionId: string) => {
    const isVisible = config?.[`show${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}` as keyof TemplateConfig] !== false;
    if (!isVisible) return null;

    switch (sectionId) {
      case "avatar":
        return (
          <div key="avatar" className={cn("w-full flex flex-col", getAlignmentClass(config?.avatarAlignment))}>
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
              <Avatar className={cn("size-24 border bg-background ring-1 transition-all duration-500", avatarRadius, theme.avatar)}>
                <AvatarImage src={profile.avatarUrl || ""} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback className="text-lg font-semibold text-background" style={{ backgroundColor: primaryColor }}>{initials}</AvatarFallback>
              </Avatar>
            </motion.div>
            <div className={cn("mt-6 w-full flex flex-col", getAlignmentClass(config?.infoAlignment))}>
              <h1 className={cn("font-display text-3xl font-semibold tracking-tight leading-tight sm:text-4xl transition-colors duration-500", theme.text)} style={{ color: textColor }}>{profile.firstName} {profile.lastName}</h1>
              <p className={cn("mt-2 text-sm font-medium tracking-tight transition-colors duration-500", theme.subtext)} style={{ color: textColor, opacity: 0.6 }}>{profile.positionTitle} {profile.organization?.name && `at ${profile.organization.name}`}</p>
              {config?.showVerifyBadge !== false && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all duration-500",
                    buttonRadius, glassStyle,
                    theme.badge,
                    "text-brass border-brass/25"
                  )}>
                    <ShieldCheck className="size-3.5 text-brass" aria-hidden="true" />
                    {config?.verifyBadgeText || "Verified Identity"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "header":
        return (
          <div key="header" className="w-full flex flex-col items-center">
            <div className="w-full max-w-[430px]">
              <motion.button type="button" aria-label="Flip digital business card" aria-pressed={isFlipped} onClick={toggleCardFlip} onKeyDown={toggleCardFlipFromKeyboard} whileTap={{ scale: 0.985 }} className="group block w-full rounded-lg text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground/15" style={{ perspective: 1400 }}>
                {renderProfileCard(profile, isFlipped, layoutKey)}
              </motion.button>
              <button type="button" onClick={toggleCardFlip} onKeyDown={toggleCardFlipFromKeyboard} className={cn("mx-auto mt-4 flex items-center gap-2 px-3 py-2 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none", theme.subtext)}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Tap to flip
              </button>
            </div>
          </div>
        );

      case "bio":
        return config?.bioText ? (
          <div key="bio" className={cn("w-full max-w-[430px] flex flex-col", getAlignmentClass(config?.bioAlignment))}>
            <p className={cn("text-sm leading-relaxed", theme.text)} style={{ color: textColor }}>{config.bioText}</p>
          </div>
        ) : null;

      case "socials":
        return (
          <motion.nav key="socials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.42, ease: [0.22, 1, 0.36, 1] }} aria-label="Contact actions" className={cn("w-full max-w-[430px]", config?.socialsLayout === "list" ? "flex flex-col gap-3" : cn("flex flex-wrap gap-6", getJustifyClass(config?.socialsAlignment)))}>
            {contactActions.map((action) => (
              <a 
                key={action.label} 
                href={action.href} 
                target={action.external ? "_blank" : undefined} 
                rel={action.external ? "noreferrer" : undefined} 
                aria-label={action.label} 
                className={cn("group outline-none focus-visible:ring-2 focus-visible:ring-ring/40", config?.socialsLayout === "list" ? cn("flex items-center gap-3 w-full p-2 border border-border/50 rounded-lg hover:bg-muted/30 transition-all", theme.subtext) : "flex flex-col items-center gap-2 text-center")}
                onClick={() => {
                  posthog.capture("social_link_clicked", {
                    profileId: profile.id,
                    profileName: `${profile.firstName} ${profile.lastName}`,
                    socialPlatform: action.label,
                    url: action.href,
                  });
                }}
              >
                {config?.socialsLayout === "list" ? (
                  <>
                    <action.icon
                      className="size-4 shrink-0"
                      style={{ color: config?.socialsIconColor || accentColor }}
                      aria-hidden="true"
                    />
                    {config?.showSocialLabels !== false && <span className="text-sm font-medium">{action.label}</span>}
                  </>
                ) : (
                  <>
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md",
                        !config?.socialsButtonColor && !config?.secondaryButtonColor && (layoutKey === "glass" || layoutKey === "modern-dark" ? "bg-cream/5 border-cream/20" : theme.secondaryButton),
                        buttonRadius,
                        glassStyle
                      )}
                      style={{
                        borderColor: config?.socialsButtonColor || config?.secondaryButtonColor || primaryColor,
                        backgroundColor: config?.socialsFillColor || (config?.socialsButtonColor ? `${config.socialsButtonColor}10` : undefined)
                      }}
                    >
                      <action.icon
                        className="size-4.5"
                        style={{ color: config?.socialsIconColor || accentColor }}
                        aria-hidden="true"
                      />
                    </span>
                    {config?.showSocialLabels !== false && (
                      <span className={cn("text-[10px] font-bold uppercase", theme.subtext)} style={{ color: textColor, opacity: 0.8 }}>{action.label}</span>
                    )}
                  </>
                )}
              </a>
            ))}
          </motion.nav>
        );

      case "actions":
        return (
          <div key="actions" className={cn("w-full max-w-[430px] space-y-3 flex flex-col", getAlignmentClass(config?.actionsAlignment))}>
            {config?.showVCard !== false && (
              <Button asChild size="lg" className={cn("h-11 w-full transition-all duration-500", buttonRadius, layoutKey === "glass" || layoutKey === "modern-dark" ? "bg-brass text-brass-foreground hover:bg-brass/90" : theme.button)} style={layoutKey === "glass" || layoutKey === "modern-dark" ? {} : { backgroundColor: primaryBtnBg, color: primaryBtnText }}>
                <a 
                  href={vCardHref} 
                  download={`${profile.firstName}-${profile.lastName}.vcf`} 
                  onClick={() => { 
                    analyticsService.trackEvent({ profileId: profile.id, eventType: "SAVE_CONTACT", channel: getAnalyticsChannel() }).catch(console.error); 
                    posthog.capture("contact_saved", {
                      profileId: profile.id,
                      profileName: `${profile.firstName} ${profile.lastName}`,
                    });
                  }}
                >
                  <Download className="size-4" aria-hidden="true" />
                  {primaryBtnLabel}
                </a>
              </Button>
            )}
            <a href={profile.organization?.website || "#"} target="_blank" rel="noreferrer" className={cn("flex h-11 w-full items-center justify-center gap-2 border px-4 text-sm font-medium shadow-sm transition-all duration-500 bg-transparent", buttonRadius, (layoutKey === "glass" || layoutKey === "modern-dark") ? "bg-cream/5 border-cream/15 text-cream backdrop-blur-md hover:bg-cream/10" : "")} style={(layoutKey === "glass" || layoutKey === "modern-dark") ? {} : { borderColor: secondaryBtnColor, color: secondaryBtnText }}>
              {secondaryBtnLabel}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        );

      case "footer":
        return (
          <footer key="footer" className={cn("flex items-center justify-center gap-2 text-xs transition-colors duration-500", theme.footer)}>
            <span>Powered by Handshakes</span>
          </footer>
        );

      default: return null;
    }
  };

  return (
    <div className={cn("min-h-svh w-full transition-all duration-500 relative", useThemeBg ? theme.bg : "")} style={{ ...backgroundStyle, fontFamily: config?.fontFamily || "inherit" }}>
      {pagePattern && <div className="absolute inset-0 pointer-events-none z-0" style={pagePattern} />}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={cn("relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-center px-5 sm:px-6", spacingClass)}>
        {config?.showTopBadge !== false && (
          <Badge variant="outline" className={cn("h-6 px-2 text-[9px] uppercase font-semibold tracking-wide transition-all duration-500 mb-2 rounded-full", theme.badge, glassStyle)}>
            <StatusDot />
            {config?.topBadgeText || "Digital Business Card"}
          </Badge>
        )}
        {sectionsOrder.map(sectionId => {
          const content = renderSection(sectionId);
          if (!content) return null;
          return <div key={sectionId} className="w-full flex flex-col items-center">{content}</div>;
        })}
      </motion.section>
    </div>
  );
}
