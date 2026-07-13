import { NextRequest, NextResponse } from "next/server";
import { CLOUDINARY_FOLDERS, getCloudinaryConfig, type CloudinaryFolder } from "@/lib/cloudinary";

const allowedFormats = "jpg,jpeg,png,webp,avif";
export async function POST(request: NextRequest) {
  // Replace with a verified admin/member session check when auth is connected.
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Uploads require authenticated sessions before production use." }, { status: 503 });
  try {
    const body = (await request.json()) as { folder?: CloudinaryFolder };
    const folder = CLOUDINARY_FOLDERS[body.folder ?? "gallery"];
    if (!folder) return NextResponse.json({ error: "Invalid upload destination." }, { status: 400 });
    const { cloudinary, cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const params = { timestamp, folder, allowed_formats: allowedFormats, unique_filename: true, use_filename: false };
    const signature = cloudinary.utils.api_sign_request(params, apiSecret);
    return NextResponse.json({ signature, timestamp, folder, allowedFormats, cloudName, apiKey });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to prepare upload." }, { status: 500 });
  }
}
