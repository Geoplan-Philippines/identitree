"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { organizationSchema, type OrganizationValues as OrganizationSetupValues } from "@/lib/zod/organizations";
import { Loader2, Nfc } from "lucide-react";

type OrganizationSetupFormProps = {
  userId?: string;
};

export function OrganizationSetupForm({
  userId: serverUserId,
}: OrganizationSetupFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setOrganizationSlug } = useAuth();
  const userId = searchParams.get("userId") ?? serverUserId ?? user?.id ?? "";

  const form = useForm<OrganizationSetupValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      website: "",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "identitree/logo");

    const response = await apiClient.post<any>("/upload/image", formData);
    return response.url;
  };

  async function onSubmit(data: OrganizationSetupValues) {
    if (!userId) {
      toast.error("Missing user context", {
        description: "Please login again before creating an organization.",
      });
      return;
    }

    try {
      let logoUrl: string | undefined;

      if (logoFile) {
        setIsUploading(true);
        try {
          logoUrl = await uploadToCloudinary(logoFile);
        } catch (error) {
          toast.error("Failed to upload logo");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const { data: organization, error } = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
        ...(data.website ? { website: data.website } : {}),
        ...(logoUrl ? { logo: logoUrl } : {}),
      });

      if (error) {
        throw new Error(error.message || "Failed to create organization");
      }

      toast.success("Organization created");

      if (organization) {
        setOrganizationSlug(organization.slug);
        router.push(`/dashboard/${organization.slug}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create organization";
      toast.error("Unable to continue", {
        description: message,
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="organization-name">Organization name</FieldLabel>
              <Input
                {...field}
                id="organization-name"
                type="text"
                placeholder="Acme Inc"
                autoComplete="organization"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="organization-slug">Dashboard slug</FieldLabel>
              <Input
                {...field}
                id="organization-slug"
                type="text"
                placeholder="acme-inc"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="organization-website">Company Website (Optional)</FieldLabel>
              <Input
                {...field}
                id="organization-website"
                type="url"
                placeholder="https://acme-inc.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="organization-logo">Organization Logo (Optional)</FieldLabel>
          <div className="flex items-center gap-4">
            {logoFile && (
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-muted">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Input
                id="organization-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </Field>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isUploading}>
          {form.formState.isSubmitting || isUploading ? "Saving..." : "Continue to dashboard"}
        </Button>
      </FieldGroup>
    </form>
  );
}
