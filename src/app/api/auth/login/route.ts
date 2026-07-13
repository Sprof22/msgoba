import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { assertSameOrigin, createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { rateLimit, requestKey } from "@/lib/rate-limit";
import { User } from "@/models/User";
const schema=z.object({email:z.string().email().transform(v=>v.toLowerCase()),password:z.string().min(1)});
export async function POST(request:Request){try{await assertSameOrigin(request);if(!rateLimit(requestKey(request,"login"),8))return NextResponse.json({error:"Too many sign-in attempts. Try again later."},{status:429});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Enter a valid email and password."},{status:400});await connectToDatabase();const user=await User.findOne({email:parsed.data.email}).select("+passwordHash");if(!user?.passwordHash||!await bcrypt.compare(parsed.data.password,user.passwordHash))return NextResponse.json({error:"Email or password is incorrect."},{status:401});if(user.status==="suspended")return NextResponse.json({error:"This account has been suspended. Contact an administrator."},{status:403});if(!user.emailVerifiedAt)return NextResponse.json({error:"Verify your email address before signing in.",needsVerification:true},{status:403});await createSession(String(user._id));user.lastLoginAt=new Date();await user.save();const admin=user.roles.some((role:string)=>["admin","super_admin"].includes(role));return NextResponse.json({message:"Signed in successfully.",redirectTo:admin?"/admin":user.status==="verified"?"/members":"/account/pending"})}catch(error){console.error("Login failed",error);return NextResponse.json({error:"Sign in is temporarily unavailable."},{status:500})}}
