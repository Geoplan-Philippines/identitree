import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only."),
  website: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val) return val;
      let url = val.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      return url.replace(/^http:\/\//, "https://");
    })
    .pipe(z.string().url("Please enter a valid URL.").optional().or(z.literal(""))),
});

export type OrganizationValues = z.infer<typeof organizationSchema>;
