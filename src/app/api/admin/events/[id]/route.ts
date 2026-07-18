import { NextResponse } from "next/server";
import { z } from "zod";
import {
  assertSameOrigin,
  getCurrentUser,
  hasAdminRole,
  hasContentRole,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { recordPublication } from "@/lib/publishing";
import { Event } from "@/models/Event";
const schema = z.object({
  title: z.string().trim().min(5).max(160),
  summary: z.string().trim().min(10).max(350),
  description: z.string().trim().min(20).max(30000),
  startAt: z.string(),
  endAt: z.string().optional(),
  timezone: z.string(),
  venue: z.string().max(200).optional(),
  mapUrl: z.string().url().or(z.literal("")).optional(),
  agenda: z.string().max(10000).optional(),
  dressCode: z.string().max(150).optional(),
  contactEmail: z.string().email().or(z.literal("")).optional(),
  capacity: z.number().int().min(0).max(10000).optional(),
  allowGuests: z.boolean(),
  maxGuests: z.number().int().min(0).max(10),
  visibility: z.enum(["public", "members", "admins"]),
  status: z.enum([
    "draft",
    "review",
    "scheduled",
    "published",
    "cancelled",
    "completed",
    "archived",
  ]),
  featured: z.boolean(),
  coverImage: z.string().url().or(z.literal("")).optional(),
  coverImagePublicId: z.string().optional(),
  publishAt: z.string().optional(),
});
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasContentRole(actor))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Check the event." },
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
      event = await Event.findById(id);
    if (!event)
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    const wasLive = ["published", "scheduled"].includes(event.status),
      wasCancelled = event.status === "cancelled";
    event.set({
      ...parsed.data,
      lastEditorId: actor!.id,
      startAt: new Date(parsed.data.startAt),
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : undefined,
      publishAt: parsed.data.publishAt
        ? new Date(parsed.data.publishAt)
        : undefined,
    });
    if (event.endAt && event.endAt < event.startAt)
      return NextResponse.json(
        { error: "End time must be after start time." },
        { status: 400 },
      );
    if (event.status === "published" && !event.publishedAt) {
      event.publishedAt = new Date();
      event.publishAt = event.publishAt || new Date();
      event.publishedBy = actor!.id;
    }
    await event.save();
    await recordPublication({
      actorId: actor!.id,
      action:
        event.status === "cancelled" && !wasCancelled
          ? "event.cancelled"
          : "event.updated",
      entityType: "event",
      entity: event,
      notify: true,
    });
    return NextResponse.json({ message: "Event updated.", event });
  } catch {
    return NextResponse.json(
      { error: "Unable to update event." },
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
    event = await Event.findByIdAndUpdate(
      id,
      { $set: { status: "archived", lastEditorId: actor!.id } },
      { new: true },
    );
  if (!event)
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  await recordPublication({
    actorId: actor!.id,
    action: "event.archived",
    entityType: "event",
    entity: event,
  });
  return NextResponse.json({ message: "Event archived." });
}
