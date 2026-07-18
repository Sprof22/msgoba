import type { Viewer } from "./profile";
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
export function audienceValues(viewer: Viewer) {
  if (viewer?.roles?.some((r) => ["admin", "super_admin"].includes(r)))
    return ["public", "members", "admins"];
  if (viewer?.status === "verified") return ["public", "members"];
  return ["public"];
}
export function liveContentFilter(audience: string[]) {
  const now = new Date();
  return {
    audience: { $in: audience },
    $and: [
      {
        $or: [
          { status: "published" },
          { status: "scheduled", publishAt: { $lte: now } },
        ],
      },
      {
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      },
    ],
  };
}
export function liveEventFilter(visibility: string[]) {
  const now = new Date();
  return {
    visibility: { $in: visibility },
    $or: [
      { status: "published" },
      { status: "scheduled", publishAt: { $lte: now } },
      { status: "cancelled", publishedAt: { $exists: true } },
    ],
  };
}
