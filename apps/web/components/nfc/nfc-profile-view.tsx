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
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-1 text-muted-foreground">
          <Icon size={16} />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold break-words">{value}</p>
      </div>
    </div>
  );
}

export function NfcProfileView({
  profile,
  cardId,
  onEdit,
}: NfcProfileViewProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="p-6 space-y-6">
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
              className="rounded-xl text-xs font-semibold"
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
            value={profile.contactNumber}
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
        {(profile.linkedinUsername ||
          profile.whatsappNumber ||
          profile.viberNumber) && (
            <div className="pt-4 border-t space-y-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Social & Messaging
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field
                  label="LinkedIn"
                  value={profile.linkedinUsername}
                  icon={LinkIcon}
                />
                <Field
                  label="WhatsApp"
                  value={profile.whatsappNumber}
                  icon={Phone}
                />
                <Field
                  label="Viber"
                  value={profile.viberNumber}
                  icon={Phone}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
