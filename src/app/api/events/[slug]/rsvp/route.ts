import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { assertSameOrigin, getCurrentUser } from "@/lib/auth";
import { audienceValues, liveEventFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { Event } from "@/models/Event";
import { Rsvp } from "@/models/Rsvp";
const schema = z.object({
  response: z.enum(["attending", "maybe", "declined"]),
  guestCount: z.number().int().min(0).max(10),
  guestNames: z.array(z.string().trim().min(2).max(100)).max(10),
  note: z.string().trim().max(500).optional(),
});
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!actor || actor.status !== "verified")
      return NextResponse.json(
        { error: "Verified membership required." },
        { status: 401 },
      );
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Check your RSVP." },
        { status: 400 },
      );
    await connectToDatabase();
    const { slug } = await params,
      event = await Event.findOne({
        ...liveEventFilter(audienceValues(actor)),
        slug,
      });
    if (!event || event.status === "cancelled" || event.startAt < new Date())
      return NextResponse.json(
        { error: "RSVPs are not available for this event." },
        { status: 400 },
      );
    const guests =
      parsed.data.response === "attending" ? parsed.data.guestCount : 0;
    if (guests > 0 && (!event.allowGuests || guests > event.maxGuests))
      return NextResponse.json(
        { error: `This event permits at most ${event.maxGuests} guest(s).` },
        { status: 400 },
      );
    if (parsed.data.guestNames.length !== guests)
      return NextResponse.json(
        { error: "Add the name of each guest." },
        { status: 400 },
      );
    if (parsed.data.response === "attending" && event.capacity) {
      const totals = await Rsvp.aggregate([
        {
          $match: {
            eventId: event._id,
            response: "attending",
            userId: {
              $ne: new mongoose.Types.ObjectId(actor.id),
            },
          },
        },
        {
          $group: { _id: null, count: { $sum: { $add: [1, "$guestCount"] } } },
        },
      ]);
      if ((totals[0]?.count || 0) + 1 + guests > event.capacity)
        return NextResponse.json(
          { error: "This event has reached capacity." },
          { status: 409 },
        );
    }
    const rsvp = await Rsvp.findOneAndUpdate(
      { eventId: event._id, userId: actor.id },
      {
        $set: {
          ...parsed.data,
          guestCount: guests,
          guestNames: parsed.data.guestNames.slice(0, guests),
          respondedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true },
    );
    await AuditLog.create({
      actorId: actor.id,
      action: "event.rsvp_updated",
      targetType: "event",
      targetId: String(event._id),
      metadata: { response: rsvp.response, guestCount: rsvp.guestCount },
    });
    return NextResponse.json({ message: "Your RSVP has been saved.", rsvp });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to save your RSVP." },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await assertSameOrigin(request);
  const actor = await getCurrentUser();
  if (!actor)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const { slug } = await params,
    event = await Event.findOne({ slug });
  if (event) await Rsvp.deleteOne({ eventId: event._id, userId: actor.id });
  return NextResponse.json({ message: "RSVP removed." });
}
