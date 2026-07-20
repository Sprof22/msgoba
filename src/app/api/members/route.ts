import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { MemberProfile } from "@/models/MemberProfile";
import { User } from "@/models/User";
export async function GET(request: NextRequest) {
  const viewer = await getCurrentUser();
  if (!viewer || viewer.status !== "verified")
    return NextResponse.json(
      { error: "Verified membership required." },
      { status: 401 },
    );
  await connectToDatabase();
  const page = Math.max(
    1,
    Number(request.nextUrl.searchParams.get("page")) || 1,
  ),
    limit = 12,
    query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) || "",
    country = request.nextUrl.searchParams.get("country")?.trim(),
    occupation = request.nextUrl.searchParams.get("occupation")?.trim();
  const filter: any = {
    moderationStatus: { $in: ["visible", "memorial"] },
    $and: [
      {
        $or: [
          { "visibility.profile": { $in: ["members", "public"] } },
          { userId: viewer.id },
        ],
      },
    ],
  };
  if (query) {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { fullName: { $regex: safe, $options: "i" } },
      { nickname: { $regex: safe, $options: "i" } },
      { occupation: { $regex: safe, $options: "i" } },
      { city: { $regex: safe, $options: "i" } },
      { country: { $regex: safe, $options: "i" } },
    ];
  }
  if (country) filter.country = country;
  if (occupation)
    filter.occupation = {
      $regex: occupation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  const approved = (await User.find({
    status: "verified",
    roles: { $nin: ["admin", "super_admin"] },
  })
    .select("_id")
    .lean()) as any[];
  filter.userId = { $in: approved.map((u) => u._id) };
  const [profiles, total] = await Promise.all([
    MemberProfile.find(filter)
      .select(
        "userId fullName nickname profileImage occupation city country moderationStatus professionalSummary",
      )
      .sort({ fullName: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MemberProfile.countDocuments(filter),
  ]);
  return NextResponse.json({
    members: (profiles as any[]).map((p) => ({
      id: String(p.userId),
      fullName: p.fullName,
      nickname: p.nickname,
      profileImage: p.profileImage,
      occupation: p.occupation,
      city: p.city,
      country: p.country,
      professionalSummary: p.professionalSummary,
      memorial: p.moderationStatus === "memorial",
    })),
    pagination: {
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      total,
      limit,
    },
  });
}
