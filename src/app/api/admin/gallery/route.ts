import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { galleryPhotoInputSchema } from "@/lib/gallery";
import { GalleryPhoto } from "@/models/GalleryPhoto";

export async function GET(){const actor=await getCurrentUser();if(!hasAdminRole(actor))return NextResponse.json({error:"Forbidden"},{status:403});await connectToDatabase();const photos=await GalleryPhoto.find({}).sort({takenAt:-1,createdAt:-1}).limit(500).lean();return NextResponse.json({photos});}
export async function POST(request:Request){try{await assertSameOrigin(request);const actor=await getCurrentUser();if(!hasAdminRole(actor))return NextResponse.json({error:"Forbidden"},{status:403});const parsed=galleryPhotoInputSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||"Check the photo details."},{status:400});await connectToDatabase();const photo=await GalleryPhoto.create({...parsed.data,takenAt:parsed.data.takenAt?new Date(parsed.data.takenAt):undefined,credit:parsed.data.credit||undefined,createdBy:actor!.id,updatedBy:actor!.id});return NextResponse.json({photo},{status:201});}catch{return NextResponse.json({error:"Unable to save photo."},{status:500});}}
