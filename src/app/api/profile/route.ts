import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import {
  completionScore,
  publicProfileDTO,
  splitList,
  VISIBILITY_VALUES,
} from "@/lib/profile";
import { AuditLog } from "@/models/AuditLog";
import { MemberProfile } from "@/models/MemberProfile";
import { User } from "@/models/User";
import { getCloudinaryConfig } from "@/lib/cloudinary";

const vis = z.enum(VISIBILITY_VALUES);
const optional = z.string().trim().max(500).optional();
const schema = z.object({
  fullName: z.string().trim().min(3).max(100),
  nickname: z.string().trim().max(60).optional(),
  house: z.string().trim().max(40).optional(),
  classArm: z.string().trim().max(30).optional(),
  occupation: z.string().trim().max(100).optional(),
  industry: z.string().trim().max(100).optional(),
  employer: z.string().trim().max(120).optional(),
  professionalSummary: z.string().trim().max(300).optional(),
  bio: z.string().trim().max(1200).optional(),
  city: z.string().trim().max(80).optional(),
  region: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  website: z.string().url().or(z.literal("")).optional(),
  birthday: z.string().trim().max(20).optional(),
  schoolMemory: z.string().trim().max(800).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  education: z
    .array(
      z.object({
        institution: z.string().trim().max(120),
        qualification: z.string().trim().max(120),
        year: z.string().trim().max(10),
      }),
    )
    .max(8)
    .optional(),
  business: z
    .object({
      name: z.string().trim().max(100).optional(),
      description: z.string().trim().max(300).optional(),
      website: z.string().url().or(z.literal("")).optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      linkedin: optional,
      instagram: optional,
      facebook: optional,
      x: optional,
    })
    .optional(),
  profileImage: z.string().url().optional(),
  profileImagePublicId: z.string().startsWith("msg-2012/profiles/").optional(),
  visibility: z.object({
    email: vis,
    phone: vis,
    whatsapp: vis,
    location: vis,
    occupation: vis,
    employer: vis,
    birthday: vis,
    socialLinks: vis,
    business: vis,
    education: vis,
    achievements: vis,
    profile: vis,
  }),
});
export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const [profile, account] = await Promise.all([
    MemberProfile.findOne({ userId: user.id }).lean(),
    User.findById(user.id).lean(),
  ]);
  if (!profile || !account)
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  return NextResponse.json({
    profile: publicProfileDTO(profile, account, user),
  });
}
export async function PATCH(request: Request) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!actor)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Check your profile." },
        { status: 400 },
      );
    if (
      parsed.data.profileImage &&
      !new URL(parsed.data.profileImage).hostname.endsWith("res.cloudinary.com")
    )
      return NextResponse.json(
        { error: "Profile images must be uploaded through Cloudinary." },
        { status: 400 },
      );
    await connectToDatabase();
    const previous = (await MemberProfile.findOne({ userId: actor.id })
      .select("profileImagePublicId")
      .lean()) as { profileImagePublicId?: string } | null;
    const data: any = {
      ...parsed.data,
      skills: splitList(parsed.data.skills),
      interests: splitList(parsed.data.interests),
      achievements: splitList(parsed.data.achievements, 20),
    };
    data.completionScore = completionScore(data);
    data.profileComplete = data.completionScore >= 80;
    const profile = await MemberProfile.findOneAndUpdate(
      { userId: actor.id },
      { $set: data },
      { new: true, runValidators: true, upsert: true },
    );
    if (
      parsed.data.profileImagePublicId &&
      previous?.profileImagePublicId &&
      previous.profileImagePublicId !== parsed.data.profileImagePublicId
    ) {
      const { cloudinary } = getCloudinaryConfig();
      await cloudinary.uploader.destroy(previous.profileImagePublicId, {
        resource_type: "image",
        invalidate: true,
      });
    }
    await User.updateOne(
      { _id: actor.id },
      {
        $set: {
          name: data.fullName,
          nickname: data.nickname,
          house: data.house,
        },
      },
    );
    await AuditLog.create({
      actorId: actor.id,
      action: "profile.updated",
      targetType: "memberProfile",
      targetId: String(profile._id),
      metadata: {
        fields: Object.keys(parsed.data).filter((k) => k !== "visibility"),
      },
    });
    return NextResponse.json({
      message: "Profile saved.",
      completionScore: data.completionScore,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to save your profile." },
      { status: 500 },
    );
  }
}
