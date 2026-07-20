import { z } from "zod";

export const announcementCategories = ["general", "welfare", "reunion", "executive", "community", "business", "memorial"] as const;
export const announcementAudiences = ["public", "members", "admins"] as const;
export const announcementStatuses = ["draft", "review", "scheduled", "published", "archived"] as const;

export const announcementInputSchema = z.object({
  title: z.string().trim().min(5).max(160), summary: z.string().trim().min(10).max(350), body: z.string().trim().min(20).max(30000),
  category: z.enum(announcementCategories), audience: z.enum(announcementAudiences), status: z.enum(announcementStatuses),
  featured: z.boolean().default(false), pinned: z.boolean().default(false), coverImage: z.string().url().or(z.literal("")).optional(),
  coverImagePublicId: z.string().max(250).optional(), publishAt: z.string().optional(), expiresAt: z.string().optional(),
  attachments: z.array(z.object({ name: z.string().trim().min(1).max(180), url: z.string().url(), publicId: z.string().startsWith("msg-2012/announcements/"), format: z.string().max(20), bytes: z.number().nonnegative().max(15 * 1024 * 1024) })).max(8).default([]),
}).superRefine((data, context) => {
  if (data.status === "scheduled" && !data.publishAt) context.addIssue({ code: "custom", path: ["publishAt"], message: "Scheduled announcements need a publication date." });
  const publishAt = data.publishAt ? new Date(data.publishAt) : null;
  const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  if (publishAt && Number.isNaN(publishAt.getTime())) context.addIssue({ code: "custom", path: ["publishAt"], message: "Enter a valid publication date." });
  if (expiresAt && Number.isNaN(expiresAt.getTime())) context.addIssue({ code: "custom", path: ["expiresAt"], message: "Enter a valid expiry date." });
  if (publishAt && expiresAt && expiresAt <= publishAt) context.addIssue({ code: "custom", path: ["expiresAt"], message: "Expiry must be later than publication." });
  if (data.coverImage && !new URL(data.coverImage).hostname.endsWith("res.cloudinary.com")) context.addIssue({ code: "custom", path: ["coverImage"], message: "Cover images must be uploaded through Cloudinary." });
  if (data.coverImagePublicId && !data.coverImagePublicId.startsWith("msg-2012/announcements/")) context.addIssue({ code: "custom", path: ["coverImagePublicId"], message: "Invalid announcement image reference." });
  for (const [index, attachment] of data.attachments.entries()) if (!new URL(attachment.url).hostname.endsWith("res.cloudinary.com")) context.addIssue({ code: "custom", path: ["attachments", index, "url"], message: "Attachments must be uploaded through Cloudinary." });
});

export function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
