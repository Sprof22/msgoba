import { NextResponse } from "next/server";
import {
  assertSameOrigin,
  getCurrentUser,
  hasAdminRole,
  hasContentRole,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { recordPublication } from "@/lib/publishing";
import { Announcement } from "@/models/Announcement";
import { announcementInputSchema } from "@/lib/announcement";
import { getCloudinaryConfig } from "@/lib/cloudinary";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const { id } = await params,
      item = await Announcement.findById(id);
    if (!item)
      return NextResponse.json(
        { error: "Announcement not found." },
        { status: 404 },
      );
    const wasLive = ["published", "scheduled"].includes(item.status);
    const previousCoverPublicId = item.coverImagePublicId;
    const previousAttachments = (item.attachments || []).map((attachment: any) =>
      String(attachment.publicId),
    );
    item.set({
      ...parsed.data,
      lastEditorId: actor!.id,
      publishAt: parsed.data.publishAt
        ? new Date(parsed.data.publishAt)
        : undefined,
      expiresAt: parsed.data.expiresAt
        ? new Date(parsed.data.expiresAt)
        : undefined,
    });
    if (item.status === "published" && !item.publishedAt) {
      item.publishedAt = new Date();
      item.publishAt = item.publishAt || new Date();
      item.publishedBy = actor!.id;
    }
    await item.save();
    if (
      previousCoverPublicId &&
      previousCoverPublicId !== (parsed.data.coverImagePublicId || "")
    ) {
      const { cloudinary } = getCloudinaryConfig();
      await cloudinary.uploader.destroy(previousCoverPublicId, {
        resource_type: "image",
        invalidate: true,
      });
    }
    const retainedAttachments = new Set(
      (parsed.data.attachments || []).map((attachment) => attachment.publicId),
    );
    const removedAttachments = previousAttachments.filter(
      (publicId: string) => publicId && !retainedAttachments.has(publicId),
    );
    if (removedAttachments.length) {
      const { cloudinary } = getCloudinaryConfig();
      await Promise.all(
        removedAttachments.map((publicId: string) =>
          cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
            invalidate: true,
          }),
        ),
      );
    }
    await recordPublication({
      actorId: actor!.id,
      action: "announcement.updated",
      entityType: "announcement",
      entity: item,
      notify: !wasLive,
    });
    return NextResponse.json({
      message: "Announcement updated.",
      announcement: item,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to update announcement." },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await assertSameOrigin(request);
  const actor = await getCurrentUser();
  if (!hasAdminRole(actor))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectToDatabase();
  const { id } = await params,
    item = await Announcement.findByIdAndUpdate(
      id,
      { $set: { status: "archived", lastEditorId: actor!.id } },
      { new: true },
    );
  if (!item)
    return NextResponse.json(
      { error: "Announcement not found." },
      { status: 404 },
    );
  await recordPublication({
    actorId: actor!.id,
    action: "announcement.archived",
    entityType: "announcement",
    entity: item,
  });
  return NextResponse.json({ message: "Announcement archived." });
}
