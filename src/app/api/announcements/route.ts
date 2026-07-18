import { NextRequest,NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues,liveContentFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
export async function GET(request:NextRequest){const viewer=await getCurrentUser();await connectToDatabase();const page=Math.max(1,Number(request.nextUrl.searchParams.get("page"))||1),limit=Math.min(20,Math.max(1,Number(request.nextUrl.searchParams.get("limit"))||10)),category=request.nextUrl.searchParams.get("category"),filter:any=liveContentFilter(audienceValues(viewer));if(category)filter.category=category;const [items,total]=await Promise.all([Announcement.find(filter).select("title slug summary coverImage category audience featured pinned publishAt publishedAt createdAt").sort({pinned:-1,featured:-1,publishAt:-1,createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),Announcement.countDocuments(filter)]);return NextResponse.json({announcements:items,pagination:{page,pages:Math.max(1,Math.ceil(total/limit)),total}})}
