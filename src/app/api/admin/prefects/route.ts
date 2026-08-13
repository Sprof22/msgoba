import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { prefectInputSchema } from "@/lib/prefect";
import { Prefect } from "@/models/Prefect";

export async function GET() {
  const actor = await getCurrentUser();
  if (!hasAdminRole(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectToDatabase();
  const prefects = await Prefect.find({}).sort({ order: 1, updatedAt: -1 }).limit(200).lean();
  return NextResponse.json({ prefects });
}

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasAdminRole(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = prefectInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form details." }, { status: 400 });
    await connectToDatabase();
    const prefect = await Prefect.create({ ...parsed.data, photo: parsed.data.photo || undefined, photoPublicId: parsed.data.photoPublicId || undefined, createdBy: actor!.id, updatedBy: actor!.id });
    return NextResponse.json({ message: "Prefect created.", prefect }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create prefect." }, { status: 500 });
  }
}
