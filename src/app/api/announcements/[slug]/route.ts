import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues,liveContentFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){const viewer=await getCurrentUser(),{slug}=await params;await connectToDatabase();const item=await Announcement.findOne({...liveContentFilter(audienceValues(viewer)),slug}).lean();if(!item)return NextResponse.json({error:"Announcement not found."},{status:404});await Announcement.updateOne({_id:(item as any)._id},{$inc:{viewCount:1}});return NextResponse.json({announcement:item})}
