"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth.service";
import { useAuth } from "@/providers/auth-provider";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
});

type OrganizationSetupValues = z.infer<typeof organizationSchema>;

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
    },
  });

  async function onSubmit(data: OrganizationSetupValues) {
    if (!userId) {
      toast.error("Missing user context", {
        description: "Please login again before creating an organization.",
      });
      return;
    }

    try {
      const result = await authService.createOrganization({
        userId,
        name: data.name,
        slug: data.slug,
      });

      toast.success(result.alreadyMember ? "Organization already linked" : "Organization created");
      setOrganizationSlug(result.organizationSlug);
      router.push(`/dashboard/${result.organizationSlug}`);
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

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Continue to dashboard"}
        </Button>
      </FieldGroup>
    </form>
  );
}
