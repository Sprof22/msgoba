import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { MemberProfile } from "@/models/MemberProfile";
import { User } from "@/models/User";
const schema = z.object({
  moderationStatus: z.enum([
    "visible",
    "hidden",
    "changes_requested",
    "memorial",
  ]),
  moderationNote: z.string().trim().max(500).optional(),
  corrections: z
    .object({
      fullName: z.string().trim().min(3).max(100).optional(),
      nickname: z.string().trim().max(60).optional(),
      house: z.string().trim().max(40).optional(),
      occupation: z.string().trim().max(100).optional(),
      country: z.string().trim().max(80).optional(),
    })
    .optional(),
});
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasAdminRole(actor))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: "Check the moderation details." },
        { status: 400 },
      );
    await connectToDatabase();
    const { id } = await params;
    const profile = await MemberProfile.findOne({ userId: id });
    if (!profile)
      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 },
      );
    const changes = {
      moderationStatus: parsed.data.moderationStatus,
      moderationNote: parsed.data.moderationNote || "",
      moderatedAt: new Date(),
      moderatedBy: actor!.id,
      ...parsed.data.corrections,
    };
    profile.set(changes);
    await profile.save();
    if (
      parsed.data.corrections?.fullName ||
      parsed.data.corrections?.nickname !== undefined ||
      parsed.data.corrections?.house !== undefined
    ) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            ...(parsed.data.corrections.fullName && {
              name: parsed.data.corrections.fullName,
            }),
            ...(parsed.data.corrections.nickname !== undefined && {
              nickname: parsed.data.corrections.nickname,
            }),
            ...(parsed.data.corrections.house !== undefined && {
              house: parsed.data.corrections.house,
            }),
          },
        },
      );
    }
    await AuditLog.create({
      actorId: actor!.id,
      action: `profile.${parsed.data.moderationStatus}`,
      targetType: "memberProfile",
      targetId: String(profile._id),
      metadata: {
        note: parsed.data.moderationNote,
        corrections: Object.keys(parsed.data.corrections || {}),
      },
    });
    return NextResponse.json({ message: "Profile moderation updated." });
  } catch {
    return NextResponse.json(
      { error: "Unable to update profile moderation." },
      { status: 500 },
    );
  }
}
