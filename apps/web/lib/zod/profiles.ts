import { z } from "zod";

export const createProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  positionTitle: z.string().min(1, "Position title is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  linkedinUsername: z.string().optional(),
  whatsappNumber: z.string().optional(),
  viberNumber: z.string().optional(),
});

export type CreateProfileValues = z.infer<typeof createProfileSchema>;
