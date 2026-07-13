import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function getCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured. Add the three CLOUDINARY environment variables.");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return { cloudinary, cloudName, apiKey, apiSecret };
}

export const CLOUDINARY_FOLDERS = { profiles: "msg-2012/profiles", gallery: "msg-2012/gallery", announcements: "msg-2012/announcements", adverts: "msg-2012/adverts" } as const;
export type CloudinaryFolder = keyof typeof CLOUDINARY_FOLDERS;
