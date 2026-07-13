import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { assertSameOrigin, hashToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AuthToken } from "@/models/AuthToken";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
const schema=z.object({token:z.string().min(20),password:z.string().min(10).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)});
export async function POST(request:Request){try{await assertSameOrigin(request);const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Use at least 10 characters with upper and lowercase letters and a number."},{status:400});await connectToDatabase();const record=await AuthToken.findOne({tokenHash:hashToken(parsed.data.token),purpose:"reset_password",usedAt:{$exists:false},expiresAt:{$gt:new Date()}});if(!record)return NextResponse.json({error:"This reset link is invalid or expired."},{status:400});await User.updateOne({_id:record.userId},{$set:{passwordHash:await bcrypt.hash(parsed.data.password,12)}});await Session.deleteMany({userId:record.userId});record.usedAt=new Date();await record.save();return NextResponse.json({message:"Password updated. You can now sign in."})}catch{return NextResponse.json({error:"Unable to reset your password."},{status:500})}}
