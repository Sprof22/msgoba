import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { canSee, publicProfileDTO } from "@/lib/profile";
import { MemberProfile } from "@/models/MemberProfile";
import { User } from "@/models/User";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const viewer = await getCurrentUser();
  if (!viewer || viewer.status !== "verified")
    return NextResponse.json(
      { error: "Verified membership required." },
      { status: 401 },
    );
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  await connectToDatabase();
  const [account, profile] = await Promise.all([
    User.findOne({
      _id: id,
      status: "verified",
      roles: { $nin: ["admin", "super_admin"] },
    }).lean(),
    MemberProfile.findOne({ userId: id }).lean(),
  ]);
  if (
    !account ||
    !profile ||
    (profile as any).moderationStatus === "hidden" ||
    !canSee((profile as any).visibility?.profile, viewer, id)
  )
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  return NextResponse.json({
    profile: publicProfileDTO(profile, account, viewer),
  });
}
