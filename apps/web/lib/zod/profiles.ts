import { z } from "zod";

export const createProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  positionTitle: z.string().min(1, "Position title is required"),
  contactNumber: z.string()
    .min(1, "Contact number is required")
    .refine(val => val.replace(/\D/g, "").length === 10, "Contact number must be 10 digits")
    .refine(val => val.replace(/\D/g, "").startsWith("9"), "Contact number must start with 9"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  linkedinUsername: z.string().optional(),
  whatsappNumber: z.string().optional()
    .refine(val => !val || val.replace(/\D/g, "").length === 10, "WhatsApp number must be 10 digits")
    .refine(val => !val || val.replace(/\D/g, "").startsWith("9"), "WhatsApp number must start with 9"),
  viberNumber: z.string().optional()
    .refine(val => !val || val.replace(/\D/g, "").length === 10, "Viber number must be 10 digits")
    .refine(val => !val || val.replace(/\D/g, "").startsWith("9"), "Viber number must start with 9"),
});

export type CreateProfileValues = z.infer<typeof createProfileSchema>;
