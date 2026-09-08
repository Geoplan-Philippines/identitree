"use client";

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
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Profile, TemplateConfig } from "@/lib/services/nfc-cards.service";
import { renderProfileCard } from "./layouts/layouts-registry";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getPagePattern } from "./layouts/card-patterns";

interface TemplatePreviewProps {
  profile: Profile;
  layoutKey: string;
  onSelectSection?: (sectionId: string) => void;
  isFlipped?: boolean;
  setIsFlipped?: (flipped: boolean) => void;
}

const StatusDot = () => (
  <div className="mr-1.5 flex size-1.5 items-center justify-center">
    <div className="absolute size-1.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
    <div className="relative size-1.5 rounded-full bg-emerald-500" />
  </div>
);

export function TemplatePreview({ profile, layoutKey, onSelectSection, isFlipped = false, setIsFlipped }: TemplatePreviewProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  const config = profile.template?.config as TemplateConfig | undefined;

  useEffect(() => {
    const font = config?.fontFamily;
    if (!font || font === "inherit") return;
    const id = `font-${font.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }, [config?.fontFamily]);

  const themes = {
    default: {
      bg: "bg-[#f8fafc] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]",
      text: "text-foreground",
      subtext: "text-muted-foreground",
      badge: "border-foreground/10 bg-background/70 text-muted-foreground",
      avatar: "border-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.14)] ring-foreground/10",
      button: "shadow-[0_16px_35px_rgba(15,23,42,0.14)]",
      secondaryButton: "border-foreground/80 bg-transparent hover:bg-foreground hover:text-background text-foreground",
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
  const primaryColor = config?.primaryColor || (layoutKey === "modern-dark" ? "#3b82f6" : "#0f172a");
  const accentColor = config?.accentColor || primaryColor;
  const textColor = config?.textColor || (layoutKey === "default" ? "#0f172a" : "#ffffff");

  let backgroundStyle: any = {};
  if (config?.backgroundType === "gradient" && config.backgroundGradient) {
    backgroundStyle = { background: config.backgroundGradient };
  } else if (config?.backgroundType === "image" && config.backgroundImage) {
    backgroundStyle = { backgroundImage: `url(${config.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" };
  } else if (config?.backgroundType === "solid" && config.backgroundColor) {
    backgroundStyle = { backgroundColor: config.backgroundColor };
  }

  const buttonRadius = {
    sharp: "rounded-lg",
    rounded: "rounded-2xl",
    pill: "rounded-full"
  }[config?.buttonStyle || "sharp"];

  const avatarRadius = {
    square: "rounded-lg",
    circle: "rounded-full",
    rounded: "rounded-2xl"
  }[config?.avatarStyle || "circle"];

  const glassStyle = config?.glassmorphism ? "backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl" : "";

  const spacingClass = {
    compact: "py-4 sm:py-6 gap-4",
    relaxed: "py-8 sm:py-12 gap-8",
    loose: "py-12 sm:py-20 gap-12"
  }[config?.contentSpacing || "relaxed"];

  const pagePattern = (!config?.backgroundType || config.backgroundType === "solid")
    ? getPagePattern(config?.pagePattern)
    : null;

  const getAlignmentClass = (a?: string) =>
    a === "left" ? "items-start text-left" : a === "right" ? "items-end text-right" : "items-center text-center";

  const getJustifyClass = (a?: string) =>
    a === "left" ? "justify-start" : a === "right" ? "justify-end" : "justify-center";

  const Wrapper = ({ children, id, className }: { children: React.ReactNode, id: string, className?: string }) => (
    <div
      className={cn(
        "group/section relative w-full flex flex-col transition-all duration-300",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelectSection?.(id);
      }}
    >
      <div className="absolute -inset-x-2 -inset-y-1 border border-transparent group-hover/section:border-foreground/10 rounded-lg transition-all" />
      {children}
    </div>
  );

  const renderSection = (sectionId: string) => {
    const isVisible = config?.[`show${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}` as keyof TemplateConfig] !== false;
    if (!isVisible) return null;

    switch (sectionId) {
      case "avatar":
        return (
          <Wrapper id="avatar" key="avatar" className={getAlignmentClass(config?.avatarAlignment)}>
            <Avatar className={cn(
              "size-24 border bg-background ring-1 transition-all duration-500",
              theme.avatar,
              avatarRadius
            )}>
              <AvatarImage src={profile.avatarUrl || ""} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="text-lg font-semibold text-background" style={{ backgroundColor: primaryColor }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={cn("mt-6 w-full flex flex-col", getAlignmentClass(config?.infoAlignment))}>
              <h1
                className={cn("text-4xl font-semibold leading-tight sm:text-5xl transition-colors duration-500", theme.text)}
                style={{ color: textColor }}
              >
                {profile.firstName} {profile.lastName}
              </h1>
              <p className={cn("mt-3 text-sm font-medium sm:text-base transition-colors duration-500", theme.subtext)} style={{ color: textColor, opacity: 0.75 }}>
                {profile.positionTitle} {profile.organization?.name && `at ${profile.organization.name}`}
              </p>

              {config?.showVerifyBadge !== false && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 border px-2.5 py-1.5 shadow-sm transition-all duration-500 border-emerald-500/20 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                    buttonRadius,
                    glassStyle
                  )}>
                    <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
                    {config?.verifyBadgeText || "Identity Verified"}
                  </span>
                </div>
              )}
            </div>
          </Wrapper>
        );

      case "header":
        return (
          <Wrapper id="header" key="header" className="items-center">
            <div className="w-full max-w-[430px]">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped?.(!isFlipped);
                }}
                className="cursor-pointer"
                style={{ perspective: 1400 }}
              >
                {renderProfileCard(profile, isFlipped, layoutKey)}
              </div>
              <button
                type="button"
                className={cn(
                  "mx-auto mt-4 flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase transition",
                  theme.subtext,
                  "hover:" + theme.text
                )}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Flip card
              </button>
            </div>
          </Wrapper>
        );

      case "bio":
        return config?.bioText ? (
          <Wrapper id="bio" key="bio" className={getAlignmentClass(config?.bioAlignment)}>
            <div className="w-full max-w-[430px] px-4">
              <p className={cn("text-sm leading-relaxed", theme.text)} style={{ color: textColor }}>
                {config.bioText}
              </p>
            </div>
          </Wrapper>
        ) : null;

      case "socials":
        return (
          <Wrapper id="socials" key="socials" className={getAlignmentClass(config?.socialsAlignment)}>
            <div className={cn(
              "w-full max-w-[430px]",
              config?.socialsLayout === "list" ? "flex flex-col gap-3" : cn("flex flex-wrap gap-6", getJustifyClass(config?.socialsAlignment))
            )}>
              {[
                { label: "WhatsApp", icon: MessageCircle },
                { label: "Viber", icon: Phone },
                { label: "LinkedIn", icon: BriefcaseBusiness },
                { label: "Email", icon: Mail },
              ].map((action) => (
                <div key={action.label} className={cn(
                  "group cursor-pointer",
                  config?.socialsLayout === "list" ? "flex items-center gap-3 w-full p-2 border border-border/50 rounded-lg hover:bg-muted/30 transition-all" : "flex flex-col items-center gap-2 text-center"
                )}>
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-lg border shadow-sm transition",
                      !config?.socialsButtonColor && !config?.secondaryButtonColor && theme.secondaryButton,
                      buttonRadius,
                      glassStyle
                    )}
                    style={{ 
                      borderColor: config?.socialsButtonColor || config?.secondaryButtonColor || primaryColor,
                      backgroundColor: config?.socialsFillColor || (config?.socialsButtonColor ? `${config.socialsButtonColor}10` : undefined)
                    }}
                  >
                    <action.icon 
                      className={config?.socialsLayout === "list" ? "size-4" : "size-4.5"} 
                      style={{ color: config?.socialsIconColor || accentColor }} 
                    />
                  </span>
                  {config?.showSocialLabels !== false && (
                    <span className={cn("text-[10px] font-bold uppercase", theme.subtext)} style={{ color: textColor, opacity: 0.8 }}>
                      {action.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Wrapper>
        );

      case "actions":
        return (
          <Wrapper id="actions" key="actions" className={getAlignmentClass(config?.actionsAlignment)}>
            <div className="w-full max-w-[430px] space-y-3">
              {config?.showVCard !== false && (
                <Button
                  size="lg"
                  className={cn("h-11 w-full transition-all duration-500 shadow-sm", buttonRadius)}
                  style={{
                    backgroundColor: config?.primaryButtonColor || primaryColor,
                    color: config?.primaryButtonTextColor || "#ffffff",
                  }}
                >
                  <Download className="size-4" />
                  {config?.primaryButtonLabel || "Save Contact"}
                </Button>
              )}

              <div
                className={cn(
                  "flex h-11 w-full items-center justify-center gap-2 border px-4 text-sm font-medium shadow-sm transition-all duration-500 cursor-pointer bg-transparent",
                  buttonRadius,
                )}
                style={{
                  borderColor: config?.secondaryButtonColor || primaryColor,
                  color: config?.secondaryButtonTextColor || primaryColor,
                }}
              >
                {config?.secondaryButtonLabel || "Visit company"}
                <ArrowUpRight className="size-4" />
              </div>


            </div>
          </Wrapper>
        );

      case "footer":
        return (
          <Wrapper id="footer" key="footer" className="items-center">
            <footer className={cn("flex items-center justify-center gap-2 text-[10px] font-bold uppercase transition-colors duration-500", theme.footer)}>
              <span>Powered by Handshakes</span>
            </footer>
          </Wrapper>
        );

      default:
        return null;
    }
  };

  const sectionsOrder = config?.sectionsOrder || ["avatar", "header", "bio", "socials", "actions", "footer"];

  return (
    <div
      className={cn(
        "w-full h-full min-h-[700px] overflow-auto transition-all duration-500 relative",
        // Only apply the theme's default bg when there is truly no custom background set
        (!config?.backgroundType || config.backgroundType === "solid") && !config?.backgroundColor
          ? theme.bg
          : ""
      )}
      style={{ ...backgroundStyle, fontFamily: config?.fontFamily || "inherit" }}
    >
      {pagePattern && (
        <div className="absolute inset-0 pointer-events-none z-0" style={pagePattern} />
      )}
      <div className={cn("mx-auto flex w-full max-w-[560px] flex-col items-center px-8 relative z-10", spacingClass)}>

        {config?.showTopBadge !== false && (
          <Badge
            variant="outline"
            className={cn(
              "h-6 px-2 text-[9px] uppercase font-black transition-all duration-500 mb-2 rounded-full",
              theme.badge,
              glassStyle
            )}
          >
            <StatusDot />
            {config?.topBadgeText || "Digital Business Card"}
          </Badge>
        )}

        {sectionsOrder.map(sectionId => {
          const content = renderSection(sectionId);
          if (!content) return null;
          return <div key={sectionId} className="w-full">{content}</div>;
        })}

      </div>
    </div>
  );
}
