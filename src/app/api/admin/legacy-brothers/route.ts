import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { legacyBrotherInputSchema } from "@/lib/legacy-brother";
import { connectToDatabase } from "@/lib/mongodb";
import { LegacyBrother } from "@/models/LegacyBrother";

export async function GET() {
    const actor = await getCurrentUser();
    if (!hasAdminRole(actor)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();
    const brothers = await LegacyBrother.find({})
        .sort({ order: 1, updatedAt: -1 })
        .limit(200)
        .lean();

    return NextResponse.json({ brothers });
}

export async function POST(request: Request) {
    try {
        await assertSameOrigin(request);
        const actor = await getCurrentUser();
        if (!hasAdminRole(actor)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const parsed = legacyBrotherInputSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Check the form details." },
                { status: 400 },
            );
        }

        await connectToDatabase();
        const brother = await LegacyBrother.create({
            ...parsed.data,
            photo: parsed.data.photo || undefined,
            photoPublicId: parsed.data.photoPublicId || undefined,
            createdBy: actor!.id,
            updatedBy: actor!.id,
        });

        return NextResponse.json(
            { message: "Legacy profile created.", brother },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            { error: "Unable to create legacy profile." },
            { status: 500 },
        );
    }
}
