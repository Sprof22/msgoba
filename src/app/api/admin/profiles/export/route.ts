import { getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { MemberProfile } from "@/models/MemberProfile";
const csv = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
export async function GET() {
  const actor = await getCurrentUser();
  if (!hasAdminRole(actor)) return new Response("Forbidden", { status: 403 });
  await connectToDatabase();
  const profiles = (await MemberProfile.find({
    moderationStatus: { $ne: "hidden" },
  })
    .select(
      "fullName nickname house classArm occupation city country completionScore moderationStatus updatedAt",
    )
    .sort({ fullName: 1 })
    .lean()) as any[];
  const header = [
    "Full name",
    "Nickname",
    "House",
    "Class arm",
    "Occupation",
    "City",
    "Country",
    "Completion",
    "Status",
    "Last updated",
  ];
  const rows = profiles.map((p) => [
    p.fullName,
    p.nickname,
    p.house,
    p.classArm,
    p.occupation,
    p.city,
    p.country,
    p.completionScore,
    p.moderationStatus,
    p.updatedAt?.toISOString(),
  ]);
  await AuditLog.create({
    actorId: actor!.id,
    action: "directory.exported",
    targetType: "memberDirectory",
    targetId: "class-2012",
    metadata: { records: rows.length },
  });
  return new Response(
    [header, ...rows].map((r) => r.map(csv).join(",")).join("\n"),
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="msg-2012-directory-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    },
  );
}
