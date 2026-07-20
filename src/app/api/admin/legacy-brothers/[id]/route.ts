import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { getCloudinaryConfig } from "@/lib/cloudinary";
import { legacyBrotherInputSchema } from "@/lib/legacy-brother";
import { connectToDatabase } from "@/lib/mongodb";
import { LegacyBrother } from "@/models/LegacyBrother";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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
        const { id } = await params;
        const brother = await LegacyBrother.findById(id);

        if (!brother) {
            return NextResponse.json(
                { error: "Legacy profile not found." },
                { status: 404 },
            );
        }

        const previousPhotoPublicId = brother.photoPublicId;
        brother.set({
            ...parsed.data,
            photo: parsed.data.photo || undefined,
            photoPublicId: parsed.data.photoPublicId || undefined,
            updatedBy: actor!.id,
        });
        await brother.save();

        if (
            previousPhotoPublicId &&
            previousPhotoPublicId !== (parsed.data.photoPublicId || "")
        ) {
            const { cloudinary } = getCloudinaryConfig();
            await cloudinary.uploader.destroy(previousPhotoPublicId, {
                resource_type: "image",
                invalidate: true,
            });
        }

        return NextResponse.json({ message: "Legacy profile updated.", brother });
    } catch {
        return NextResponse.json(
            { error: "Unable to update legacy profile." },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await assertSameOrigin(request);
        const actor = await getCurrentUser();
        if (!hasAdminRole(actor)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectToDatabase();
        const { id } = await params;
        const brother = await LegacyBrother.findByIdAndDelete(id);

        if (!brother) {
            return NextResponse.json(
                { error: "Legacy profile not found." },
                { status: 404 },
            );
        }

        if (brother.photoPublicId) {
            const { cloudinary } = getCloudinaryConfig();
            await cloudinary.uploader.destroy(brother.photoPublicId, {
                resource_type: "image",
                invalidate: true,
            });
        }

        return NextResponse.json({ message: "Legacy profile deleted." });
    } catch {
        return NextResponse.json(
            { error: "Unable to delete legacy profile." },
            { status: 500 },
        );
    }
}
