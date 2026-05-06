"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

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

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
});

type OrganizationSettingsValues = z.infer<typeof organizationSchema>;

export function OrganizationSettingsForm() {
  const router = useRouter();
  const { setOrganizationSlug } = useAuth();
  const { data: activeOrg, isPending: isLoadingOrg } = authClient.useActiveOrganization();
  
  const [mounted, setMounted] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<OrganizationSettingsValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeOrg && mounted) {
      form.reset({
        name: activeOrg.name,
        slug: activeOrg.slug,
      });
      setLogoPreview(activeOrg.logo || null);
    }
  }, [activeOrg, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "identitree/logo");

    const response = await apiClient.post<any>("/upload/image", formData);
    return response.url;
  };

  async function onSubmit(data: OrganizationSettingsValues) {
    if (!activeOrg) return;

    try {
      let logoUrl = activeOrg.logo || undefined;

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

      const { data: updatedOrg, error } = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          ...(logoUrl ? { logo: logoUrl } : {}),
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to update organization");
      }

      toast.success("Organization updated successfully");

      if (updatedOrg && updatedOrg.slug !== activeOrg.slug) {
        setOrganizationSlug(updatedOrg.slug);
        router.push(`/dashboard/${updatedOrg.slug}/settings`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update organization";
      toast.error("Error", {
        description: message,
      });
    }
  }

  if (!mounted || isLoadingOrg) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Organization Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your organization details and branding.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="org-name">Organization Name</FieldLabel>
                <Input
                  {...field}
                  id="org-name"
                  placeholder="Acme Inc"
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-2">
              <div className="relative group shrink-0">
                <div className="size-20 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Upload className="size-6 text-muted-foreground/40" />
                  )}
                </div>
                <label
                  htmlFor="logo-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold uppercase text-white rounded-xl"
                >
                  Change
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Update Logo</p>
                <p className="text-xs text-muted-foreground">
                  Recommend size: 512x512px. JPG, PNG or SVG.
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </Field>

          <div className="pt-6 border-t border-border">
            <Button 
              type="submit" 
              className="w-full sm:w-auto px-10" 
              disabled={form.formState.isSubmitting || isUploading}
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
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
