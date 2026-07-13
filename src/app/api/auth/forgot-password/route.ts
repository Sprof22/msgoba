import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSameOrigin, createOpaqueToken, hashToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { sendAuthEmail } from "@/lib/email";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { AuthToken } from "@/models/AuthToken";
import { User } from "@/models/User";
export async function POST(request:Request){try{await assertSameOrigin(request);if(!rateLimit(requestKey(request,"forgot"),5,3600000))return NextResponse.json({message:"If an account exists, a reset link has been sent."});const parsed=z.object({email:z.string().email().transform(v=>v.toLowerCase())}).safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Enter a valid email address."},{status:400});await connectToDatabase();const user=await User.findOne({email:parsed.data.email});let developmentUrl:string|undefined;if(user){const token=createOpaqueToken();await AuthToken.deleteMany({userId:user._id,purpose:"reset_password"});await AuthToken.create({tokenHash:hashToken(token),userId:user._id,purpose:"reset_password",expiresAt:new Date(Date.now()+60*60*1000)});const base=process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin;developmentUrl=(await sendAuthEmail({to:user.email,name:user.name,url:`${base}/reset-password?token=${encodeURIComponent(token)}`,purpose:"reset"})).developmentUrl}return NextResponse.json({message:"If an account exists, a reset link has been sent.",developmentUrl})}catch{return NextResponse.json({error:"Password recovery is temporarily unavailable."},{status:500})}}
