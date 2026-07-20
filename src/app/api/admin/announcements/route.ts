import { NextResponse } from "next/server";
import {
  assertSameOrigin,
  getCurrentUser,
  hasAdminRole,
  hasContentRole,
} from "@/lib/auth";
import { slugify } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { recordPublication } from "@/lib/publishing";
import { Announcement } from "@/models/Announcement";
import { announcementInputSchema } from "@/lib/announcement";
export async function GET() {
  const actor = await getCurrentUser();
  if (!hasContentRole(actor))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectToDatabase();
  const items = await Announcement.find({})
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();
  return NextResponse.json({ announcements: items });
}
export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasContentRole(actor))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = announcementInputSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Check the announcement." },
        { status: 400 },
      );
    if (
      !hasAdminRole(actor) &&
      !["draft", "review"].includes(parsed.data.status)
    )
      return NextResponse.json(
        { error: "Only administrators can publish or schedule." },
        { status: 403 },
      );
    await connectToDatabase();
    const base = slugify(parsed.data.title) || "announcement";
    let slug = base,
      suffix = 1;
    while (await Announcement.exists({ slug })) slug = `${base}-${++suffix}`;
    const data: any = {
      ...parsed.data,
      slug,
      authorId: actor!.id,
      lastEditorId: actor!.id,
      publishAt: parsed.data.publishAt
        ? new Date(parsed.data.publishAt)
        : undefined,
      expiresAt: parsed.data.expiresAt
        ? new Date(parsed.data.expiresAt)
        : undefined,
    };
    if (data.status === "published") {
      data.publishedAt = new Date();
      data.publishAt = data.publishAt || new Date();
      data.publishedBy = actor!.id;
    }
    const item = await Announcement.create(data);
    await recordPublication({
      actorId: actor!.id,
      action: "announcement.created",
      entityType: "announcement",
      entity: item,
      notify: true,
    });
    return NextResponse.json(
      { message: "Announcement created.", announcement: item },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create announcement." },
      { status: 500 },
    );
  }
}
