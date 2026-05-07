import { Profile, TemplateConfig } from "@/lib/services/nfc-cards.service";

export type CardProps = {
  profile: Profile;
  config?: TemplateConfig;
  isFlipped: boolean;
};
