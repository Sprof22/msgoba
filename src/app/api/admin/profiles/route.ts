import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { MemberProfile } from "@/models/MemberProfile";
export async function GET(request:NextRequest){const actor=await getCurrentUser();if(!hasAdminRole(actor))return NextResponse.json({error:"Forbidden"},{status:403});await connectToDatabase();const status=request.nextUrl.searchParams.get("status");const filter=status?{moderationStatus:status}:{};const profiles=await MemberProfile.find(filter).select("userId fullName nickname house occupation country profileImage completionScore moderationStatus moderationNote updatedAt").sort({updatedAt:-1}).limit(200).lean() as any[];return NextResponse.json({profiles:profiles.map(p=>({...p,id:String(p.userId),_id:undefined,userId:undefined}))})}
