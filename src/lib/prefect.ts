import { z } from "zod";

export const prefectInputSchema = z.object({
  name: z.string().trim().min(3).max(100),
  post: z.string().trim().min(2).max(120),
  photo: z.string().trim().url().optional().or(z.literal("")),
  photoPublicId: z.string().trim().max(300).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999).default(0),
  active: z.boolean().default(true),
});
