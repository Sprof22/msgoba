import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser } from "@/lib/auth";
import { getCloudinaryConfig } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { MemberProfile } from "@/models/MemberProfile";
export async function DELETE(request:Request){try{await assertSameOrigin(request);const actor=await getCurrentUser();if(!actor)return NextResponse.json({error:"Unauthorized"},{status:401});await connectToDatabase();const profile=await MemberProfile.findOne({userId:actor.id});if(!profile)return NextResponse.json({error:"Profile not found."},{status:404});if(profile.profileImagePublicId){const {cloudinary}=getCloudinaryConfig();await cloudinary.uploader.destroy(profile.profileImagePublicId,{resource_type:"image",invalidate:true})}profile.profileImage=undefined;profile.profileImagePublicId=undefined;await profile.save();await AuditLog.create({actorId:actor.id,action:"profile.avatar_removed",targetType:"memberProfile",targetId:String(profile._id)});return NextResponse.json({message:"Profile photograph removed."})}catch{return NextResponse.json({error:"Unable to remove the photograph."},{status:500})}}
