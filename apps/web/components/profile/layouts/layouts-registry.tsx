import { ComponentType } from "react";
import { Profile, TemplateConfig } from "@/lib/services/nfc-cards.service";
import { DefaultLayout as DefaultCard } from "./default-layout";
import { ModernDarkLayout as ModernDarkCard } from "./modern-dark-layout";
import { GlassLayout as GlassCard } from "./glass-layout";
import { CardProps } from "./types";

export type CardRegistry = Record<string, ComponentType<CardProps>>;

export const CARD_REGISTRY: CardRegistry = {
  default: DefaultCard,
  "modern-dark": ModernDarkCard,
  glass: GlassCard,
};

export function renderProfileCard(profile: Profile, isFlipped: boolean, forcedLayoutKey?: string) {
  const layoutKey = forcedLayoutKey || profile.template?.layoutKey || "default";
  const CardComponent = (CARD_REGISTRY[layoutKey] || CARD_REGISTRY.default) as ComponentType<CardProps>;
  const config = profile.template?.config as TemplateConfig | undefined;

  return <CardComponent profile={profile} config={config} isFlipped={isFlipped} />;
}
