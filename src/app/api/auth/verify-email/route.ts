import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashToken } from "@/lib/auth";
import { AuthToken } from "@/models/AuthToken";
import { User } from "@/models/User";
export async function GET(request:NextRequest){const token=request.nextUrl.searchParams.get("token");const base=request.nextUrl.origin;if(!token)return NextResponse.redirect(`${base}/verify-email?error=missing`);await connectToDatabase();const record=await AuthToken.findOne({tokenHash:hashToken(token),purpose:"verify_email",usedAt:{$exists:false},expiresAt:{$gt:new Date()}});if(!record)return NextResponse.redirect(`${base}/verify-email?error=invalid`);await User.updateOne({_id:record.userId},{$set:{emailVerifiedAt:new Date()}});record.usedAt=new Date();await record.save();return NextResponse.redirect(`${base}/verify-email?success=1`)}
