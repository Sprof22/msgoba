import { NextResponse } from "next/server";
import { getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
export async function GET(){const actor=await getCurrentUser();if(!hasAdminRole(actor))return NextResponse.json({error:"Forbidden"},{status:403});await connectToDatabase();const users=await User.find({}).select("name nickname email house status roles emailVerifiedAt createdAt").sort({createdAt:-1}).limit(100).lean();return NextResponse.json({members:users.map(u=>({id:String(u._id),name:u.name,nickname:u.nickname,email:u.email,house:u.house,status:u.status,roles:u.roles,emailVerified:Boolean(u.emailVerifiedAt),createdAt:u.createdAt}))})}
