import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues, liveContentFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
import { announcementCategories, escapeRegex } from "@/lib/announcement";
export async function GET(request: NextRequest) {
  const viewer = await getCurrentUser();
  await connectToDatabase();
  const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page")) || 1,
    ),
    limit = Math.min(
      20,
      Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10),
    ),
    category = request.nextUrl.searchParams.get("category"),
    query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) || "",
    filter: any = liveContentFilter(audienceValues(viewer));
  if (
    category &&
    announcementCategories.includes(
      category as (typeof announcementCategories)[number],
    )
  )
    filter.category = category;
  if (query) {
    const safe = escapeRegex(query);
    filter.$and.push({
      $or: [
        { title: { $regex: safe, $options: "i" } },
        { summary: { $regex: safe, $options: "i" } },
        { body: { $regex: safe, $options: "i" } },
      ],
    });
  }
  const [items, total] = await Promise.all([
    Announcement.find(filter)
      .select(
        "title slug summary coverImage category audience featured pinned publishAt publishedAt createdAt",
      )
      .sort({ pinned: -1, featured: -1, publishAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Announcement.countDocuments(filter),
  ]);
  return NextResponse.json({
    announcements: items,
    pagination: { page, pages: Math.max(1, Math.ceil(total / limit)), total },
  });
}
