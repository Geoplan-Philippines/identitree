import { z } from "zod";

export const createProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  positionTitle: z.string().min(1, "Position title is required"),
  contactNumber: z.string().regex(/^\d{11}$/, "Contact number must be exactly 11 digits"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  linkedinUsername: z.string().optional(),
  whatsappNumber: z.string().optional().refine(val => !val || /^\d{11}$/.test(val), "WhatsApp number must be exactly 11 digits"),
  viberNumber: z.string().optional().refine(val => !val || /^\d{11}$/.test(val), "Viber number must be exactly 11 digits"),
});

export type CreateProfileValues = z.infer<typeof createProfileSchema>;
