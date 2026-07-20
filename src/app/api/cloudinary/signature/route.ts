import { NextRequest, NextResponse } from "next/server";
import {
  CLOUDINARY_FOLDERS,
  getCloudinaryConfig,
  type CloudinaryFolder,
} from "@/lib/cloudinary";
import {
  assertSameOrigin,
  getCurrentUser,
  hasAdminRole,
  hasContentRole,
} from "@/lib/auth";

const imageFormats = "jpg,jpeg,png,webp,avif";
const attachmentFormats = "pdf,doc,docx,xls,xlsx,ppt,pptx,txt";
export async function POST(request: NextRequest) {
  try {
    await assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user || user.status !== "verified")
      return NextResponse.json(
        { error: "A verified account is required." },
        { status: 401 },
      );
    const body = (await request.json()) as {
      folder?: CloudinaryFolder;
      resourceType?: "image" | "raw";
    };
    const resourceType = body.resourceType ?? "image";
    if (resourceType === "raw" && body.folder !== "announcements")
      return NextResponse.json(
        { error: "Raw attachments are limited to editorial uploads." },
        { status: 403 },
      );
    if (body.folder === "announcements" && !hasContentRole(user))
      return NextResponse.json(
        { error: "Editorial permission is required." },
        { status: 403 },
      );
    if (
      ["gallery", "adverts"].includes(body.folder || "") &&
      !hasAdminRole(user)
    )
      return NextResponse.json(
        { error: "Administrator permission is required." },
        { status: 403 },
      );
    const folder = CLOUDINARY_FOLDERS[body.folder ?? "gallery"];
    if (!folder)
      return NextResponse.json(
        { error: "Invalid upload destination." },
        { status: 400 },
      );
    const { cloudinary, cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const allowedFormats =
      resourceType === "raw" ? attachmentFormats : imageFormats;
    const params = {
      timestamp,
      folder,
      allowed_formats: allowedFormats,
      unique_filename: true,
      use_filename: false,
    };
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    return NextResponse.json({
      signature,
      timestamp,
      folder,
      allowedFormats,
      cloudName,
      apiKey,
      resourceType,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to prepare upload.",
      },
      { status: 500 },
    );
  }
}
