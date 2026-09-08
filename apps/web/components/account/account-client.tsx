"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { ImageUpload } from "@/components/shared/image-upload";
import { PageHeader, Section, ActionArea } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@/lib/services/auth.service";

const accountSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(64, "Full name must be 64 characters or fewer.")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes."),
});

type AccountValues = z.infer<typeof accountSchema>;

type AccountClientProps = {
  /** SSR-hydrated user passed from the server page */
  user: AuthUser;
};

export function AccountClient({ user: initialUser }: AccountClientProps) {
  const queryClient = useQueryClient();
  const { data: user, isPending } = useCurrentUser(initialUser);

  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: initialUser.name ?? "" },
  });

  // Sync form when query refreshes with newer data
  useEffect(() => {
    if (user?.name) form.reset({ name: user.name });
  }, [user?.name, form]);

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const isDirty = form.formState.isDirty || avatarFile !== null;

  const handleSave = async (data: AccountValues) => {
    setIsSaving(true);
    try {
      let imageUrl = user?.image ?? undefined;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("folder", "identitree/avatars");
        const { url } = await apiClient.post<{ url: string }>("/upload/image", formData);
        imageUrl = url;
      }

      const { error } = await authClient.updateUser({
        name: data.name,
        ...(imageUrl !== user?.image ? { image: imageUrl } : {}),
      });

      if (error) throw new Error(error.message || "Failed to save changes.");

      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile updated!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = avatarPreview ?? user?.image ?? null;

  if (isPending) {
    return (
      <div className="max-w-2xl space-y-10">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6 w-full max-w-2xl">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-6">
              <Skeleton className="size-20 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-8 w-28 mt-2" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="pt-6 border-t border-border">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10">
      <PageHeader
        title="My Account"
        description="Manage your personal profile and account settings."
      />

      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Profile Photo</FieldLabel>
            <ImageUpload
              value={displayImage}
              onChange={handleAvatarChange}
              label="Update Profile Photo"
              description="JPG, PNG or GIF · Max 5MB"
              inputId="avatar-upload"
              disabled={isSaving}
              className="mt-2"
            />
          </Field>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="account-name">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="account-name"
                  placeholder="Your name"
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <ActionArea>
          <Button
            type="submit"
            disabled={!isDirty || isSaving}
            className="w-full sm:w-auto px-10"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </ActionArea>
      </form>

      <Section
        title="Email Address"
        description="Email cannot be changed here."
        className="pt-6 border-t border-border"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Mail className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.email}</p>
          </div>
          {user?.emailVerified && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Verified
            </span>
          )}
        </div>
      </Section>
    </div>
  );
}
