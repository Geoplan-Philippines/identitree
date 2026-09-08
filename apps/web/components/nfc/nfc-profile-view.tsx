"use client";

import { Profile } from "@/lib/services/nfc-cards.service";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, Briefcase, Link as LinkIcon } from "lucide-react";

type NfcProfileViewProps = {
  profile: Profile;
  cardId: string;
  onEdit?: () => void;
};

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | null;
  icon?: any;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-1 text-muted-foreground">
          <Icon size={16} />
        </div>
      )}
      <div className="space-y-1 min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold break-all">
          {value || <span className="text-muted-foreground/50 italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

const displayPhone = (num: string | undefined | null) => {
  if (!num) return null;
  let clean = num.replace(/\D/g, "");
  if (clean.startsWith("63")) clean = clean.substring(2);
  if (clean.startsWith("0")) clean = clean.substring(1);
  
  // Format as +63 XXX XXX XXXX
  const part = clean.slice(0, 10);
  let formatted = `+63`;
  if (part.length > 0) formatted += ` ${part.slice(0, 3)}`;
  if (part.length > 3) formatted += ` ${part.slice(3, 6)}`;
  if (part.length > 6) formatted += ` ${part.slice(6)}`;
  
  return formatted;
};

export function NfcProfileView({
  profile,
  cardId,
  onEdit,
}: NfcProfileViewProps) {
  return (
    <div className="max-w-xl mx-auto sm:px-4 py-6">
      <div className="sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {profile.positionTitle || "No position specified"}
            </p>
          </div>

          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-xs font-semibold"
            >
              Edit
            </Button>
          )}
        </div>

        {/* Avatar */}
        {profile.avatarUrl && (
          <div className="flex justify-center">
            <a
              href={profile.avatarUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80 transition-opacity cursor-zoom-in"
            >
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
            </a>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" value={profile.firstName} icon={User} />
          <Field label="Last Name" value={profile.lastName} icon={User} />
          <Field label="Email" value={profile.email} icon={Mail} />
          <Field
            label="Contact Number"
            value={displayPhone(profile.contactNumber)}
            icon={Phone}
          />
        </div>

        {/* Position */}
        {profile.positionTitle && (
          <div className="pt-2 border-t">
            <Field
              label="Position Title"
              value={profile.positionTitle}
              icon={Briefcase}
            />
          </div>
        )}

        {/* Socials */}
        <div className="pt-4 border-t space-y-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Social & Messaging
          </p>

          <div className="flex flex-col gap-4">
            <Field
              label="LinkedIn"
              value={profile.linkedinUsername}
              icon={LinkIcon}
            />
            <Field
              label="WhatsApp"
              value={displayPhone(profile.whatsappNumber)}
              icon={Phone}
            />
            <Field
              label="Viber"
              value={displayPhone(profile.viberNumber)}
              icon={Phone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
