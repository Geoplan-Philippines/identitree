"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/shared/image-upload";
import { PageHeader, Section, ActionArea } from "@/components/shared/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";
import { useOrganization } from "@/hooks/use-organization";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
});

type OrganizationSettingsValues = z.infer<typeof organizationSchema>;

export function OrganizationSettingsForm({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setOrganizationSlug } = useAuth();

  const showSlugChangedAlert = searchParams.get("slugChanged") === "true";

  const { data: orgData, isPending: isLoading } = useOrganization(slug);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<OrganizationSettingsValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "", slug: "" },
  });

  // Populate form once data arrives
  useEffect(() => {
    if (orgData) {
      form.reset({ name: orgData.name, slug: orgData.slug });
      setLogoPreview(orgData.logo ?? null);

      // Sync active org
      authClient.organization.setActive({ organizationSlug: orgData.slug });
    }
  }, [orgData, form]);

  const handleLogoChange = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "identitree/logo");
    const response = await apiClient.post<any>("/upload/image", formData);
    return response.url;
  };

  async function onSubmit(data: OrganizationSettingsValues) {
    if (!orgData) return;

    try {
      let logoUrl = orgData.logo || undefined;

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

      const { data: updatedOrg, error } = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          ...(logoUrl ? { logo: logoUrl } : {}),
        },
      });

      if (error) throw new Error(error.message || "Failed to update organization");

      // Invalidate so the query refetches with the new slug
      queryClient.invalidateQueries({ queryKey: ["organization", slug] });

      toast.success("Organization updated successfully");

      if (updatedOrg && updatedOrg.slug !== orgData.slug) {
        await setOrganizationSlug(updatedOrg.slug);
        // Invalidate NFC cards so they refetch with the new URLs
        queryClient.invalidateQueries({ queryKey: ["nfc-cards"] });
        router.push(`/dashboard/${updatedOrg.slug}/settings?slugChanged=true`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update organization";
      toast.error("Error", { description: message });
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-10 w-full max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-0">
              <Skeleton className="h-9 w-40 rounded-r-none" />
              <Skeleton className="h-9 flex-1 rounded-l-none" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-6">
              <Skeleton className="size-20 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-8 w-28 mt-2" />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Organization Settings"
        description="Update your organization details and branding."
      />

      {showSlugChangedAlert && (
        <Alert className="bg-blue-50/50 border-blue-200/50 text-blue-900 mb-6">
          <Info className="size-4 text-blue-600" />
          <AlertTitle className="text-blue-900 font-semibold">Important: Action Required</AlertTitle>
          <AlertDescription className="text-blue-800/80">
            Since your organization URL has changed, your physical NFC cards will no longer work until you reactivate them. 
            Please use the <span className="font-bold underline cursor-pointer" onClick={() => router.push(`/dashboard/${slug}/tools`)}>Activation Tool</span> to sync your physical cards with the new link.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Section
          title="General Information"
          description="Basic details about your organization."
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
                  <Input {...field} id="org-name" placeholder="Acme Inc" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="inline-flex h-8 items-center border sm:border-r-0 border-input bg-muted px-3 text-[11px] font-medium text-muted-foreground whitespace-nowrap rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg">
                      identitree.geoplanph.com/dashboard/
                    </span>
                    <Input
                      {...field}
                      id="org-slug"
                      placeholder="acme-inc"
                      className="sm:rounded-l-none"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Changing the slug will update your dashboard URL.
                  </p>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Organization Logo</FieldLabel>
              <ImageUpload
                value={logoPreview}
                onChange={handleLogoChange}
                label="Update Logo"
                description="Recommended size: 512×512px. JPG, PNG or SVG."
                inputId="org-logo-upload"
                disabled={isUploading || form.formState.isSubmitting}
                className="mt-2"
              />
            </Field>
          </FieldGroup>

          <ActionArea>
            <Button
              type="submit"
              className="w-full sm:w-auto px-10"
              disabled={
                (!form.formState.isDirty && logoFile === null) ||
                form.formState.isSubmitting ||
                isUploading
              }
            >
              {form.formState.isSubmitting || isUploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </ActionArea>
        </Section>
      </form>
    </div>
  );
}
