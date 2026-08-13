import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { getCloudinaryConfig } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { prefectInputSchema } from "@/lib/prefect";
import { Prefect } from "@/models/Prefect";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasAdminRole(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = prefectInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form details." }, { status: 400 });
    await connectToDatabase();
    const { id } = await params;
    const prefect = await Prefect.findById(id);
    if (!prefect) return NextResponse.json({ error: "Prefect not found." }, { status: 404 });
    const previousPhotoPublicId = prefect.photoPublicId;
    prefect.set({ ...parsed.data, photo: parsed.data.photo || undefined, photoPublicId: parsed.data.photoPublicId || undefined, updatedBy: actor!.id });
    await prefect.save();
    if (previousPhotoPublicId && previousPhotoPublicId !== (parsed.data.photoPublicId || "")) {
      const { cloudinary } = getCloudinaryConfig();
      await cloudinary.uploader.destroy(previousPhotoPublicId, { resource_type: "image", invalidate: true });
    }
    return NextResponse.json({ message: "Prefect updated.", prefect });
  } catch {
    return NextResponse.json({ error: "Unable to update prefect." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin(request);
    const actor = await getCurrentUser();
    if (!hasAdminRole(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await connectToDatabase();
    const { id } = await params;
    const prefect = await Prefect.findByIdAndDelete(id);
    if (!prefect) return NextResponse.json({ error: "Prefect not found." }, { status: 404 });
    if (prefect.photoPublicId) {
      const { cloudinary } = getCloudinaryConfig();
      await cloudinary.uploader.destroy(prefect.photoPublicId, { resource_type: "image", invalidate: true });
    }
    return NextResponse.json({ message: "Prefect deleted." });
  } catch {
    return NextResponse.json({ error: "Unable to delete prefect." }, { status: 500 });
  }
}
