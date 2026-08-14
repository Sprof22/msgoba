import { z } from "zod";

export const galleryPhotoInputSchema = z.object({
  imageUrl: z.string().url(),
  imagePublicId: z.string().trim().min(1).max(300),
  caption: z.string().trim().min(3).max(180),
  album: z.string().trim().min(2).max(80),
  takenAt: z.string().trim().optional().or(z.literal("")),
  credit: z.string().trim().max(100).optional().or(z.literal("")),
  active: z.boolean().default(true),
});
