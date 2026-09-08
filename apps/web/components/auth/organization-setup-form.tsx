"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LogoDropzone } from "@/components/auth/logo-dropzone";
import { useAuth } from "@/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { bumpSlug, slugify } from "@/lib/utils/slug";
import {
  organizationSchema,
  type OrganizationValues as OrganizationSetupValues,
} from "@/lib/zod/organizations";

type OrganizationSetupFormProps = {
  userId?: string;
};

const MAX_SLUG_RETRIES = 10;

export function OrganizationSetupForm({
  userId: serverUserId,
}: OrganizationSetupFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setOrganizationSlug } = useAuth();
  const userId =
    searchParams.get("userId") ?? serverUserId ?? user?.id ?? "";

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

  // Auto-derive slug from name until the user manually edits it.
  const slugDirtyRef = useRef(false);
  const nameValue = form.watch("name");

  useEffect(() => {
    if (slugDirtyRef.current) return;
    const derived = slugify(nameValue ?? "");
    if (derived !== form.getValues("slug")) {
      form.setValue("slug", derived, { shouldValidate: true });
    }
  }, [nameValue, form]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "identitree/logo");
    const response = await apiClient.post<{ url: string }>(
      "/upload/image",
      formData,
    );
    return response.url;
  };

  async function createOrganization(
    data: OrganizationSetupValues,
    logoUrl: string | undefined,
  ) {
    let slug = data.slug;
    let attempts = 0;

    while (attempts < MAX_SLUG_RETRIES) {
      const { data: organization, error } = await authClient.organization.create({
        name: data.name,
        slug,
        ...(data.website ? { website: data.website } : {}),
        ...(logoUrl ? { logo: logoUrl } : {}),
      });

      if (!error) {
        return { organization, finalSlug: slug };
      }

      const isSlugTaken =
        error.code === "ORGANIZATION_ALREADY_EXISTS" ||
        error.message?.toLowerCase().includes("already") ||
        error.message?.toLowerCase().includes("exists");

      if (!isSlugTaken) {
        throw new Error(error.message || "Failed to create organization");
      }

      slug = bumpSlug(slug);
      attempts += 1;
    }

    throw new Error(
      "We couldn't find an available workspace URL. Try a different name.",
    );
  }

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
        } catch {
          toast.error("Failed to upload logo");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const { organization, finalSlug } = await createOrganization(data, logoUrl);

      if (finalSlug !== data.slug) {
        form.setValue("slug", finalSlug);
        toast.success("Organization created", {
          description: `Your workspace URL is "${finalSlug}". The one you chose was already taken.`,
        });
      } else {
        toast.success("Organization created");
      }

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

  const isBusy = form.formState.isSubmitting || isUploading;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="organization-name"
                className="text-[12px] font-medium text-foreground/80"
              >
                Organization name
              </FieldLabel>
              <Input
                {...field}
                id="organization-name"
                type="text"
                placeholder="Acme Inc"
                autoComplete="organization"
                aria-invalid={fieldState.invalid}
                className="h-11 px-3 text-[14px]"
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
              <FieldLabel
                htmlFor="organization-slug"
                className="text-[12px] font-medium text-foreground/80"
              >
                Workspace URL
              </FieldLabel>
              <div className="flex items-stretch border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <span
                  aria-hidden
                  className="flex select-none items-center border-r border-input bg-muted/40 px-2.5 text-[13px] text-muted-foreground"
                >
                  handshakes.cards/
                </span>
                <input
                  {...field}
                  id="organization-slug"
                  type="text"
                  placeholder="acme-inc"
                  aria-invalid={fieldState.invalid}
                  onChange={(event) => {
                    slugDirtyRef.current = true;
                    field.onChange(slugify(event.target.value));
                  }}
                  onBlur={(event) => {
                    field.onBlur();
                    if (event.target.value.trim() === "") {
                      slugDirtyRef.current = false;
                      const derived = slugify(form.getValues("name") ?? "");
                      form.setValue("slug", derived, { shouldValidate: true });
                    }
                  }}
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[14px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <FieldDescription className="text-[12px]">
                Auto-generated from your organization name. You can edit it.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="organization-website"
                className="flex w-full items-center justify-between text-[12px] font-medium text-foreground/80"
              >
                <span>Company website</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  Optional
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="organization-website"
                type="url"
                placeholder="https://acme-inc.com"
                aria-invalid={fieldState.invalid}
                className="h-11 px-3 text-[14px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel
            htmlFor="organization-logo"
            className="flex w-full items-center justify-between text-[12px] font-medium text-foreground/80"
          >
            <span>Organization logo</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Optional
            </span>
          </FieldLabel>
          <LogoDropzone
            id="organization-logo"
            value={logoFile}
            onChange={setLogoFile}
            disabled={isBusy}
          />
        </Field>

        <Button
          type="submit"
          className="mt-1 w-full text-[13.5px] font-medium shadow-sm"
          disabled={isBusy}
        >
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isUploading ? "Uploading logo…" : "Creating workspace…"}
            </>
          ) : (
            <>
              Create workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
