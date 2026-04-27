import { z } from "zod";

export const createNfcCardSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(64, { message: "Name must be at most 64 characters." }),
  cardType: z.enum(["GEOPLAN_ISSUED", "CUSTOMER_OWNED"], {
    message: "Card type is required."
  }),
  hardwareId: z.string().optional(),
});

export type CreateNfcCardValues = z.infer<typeof createNfcCardSchema>;
