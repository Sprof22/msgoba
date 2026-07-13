import { NextResponse } from "next/server";
import { assertSameOrigin, getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){await assertSameOrigin(request);const actor=await getCurrentUser();if(!hasAdminRole(actor))return NextResponse.json({error:"Forbidden"},{status:403});await connectToDatabase();const {id}=await params;const user=await User.findById(id);if(!user)return NextResponse.json({error:"Member not found."},{status:404});if(!user.emailVerifiedAt)return NextResponse.json({error:"The member must verify their email first."},{status:400});user.status="verified";user.approvedAt=new Date();user.approvedBy=actor!.id;await user.save();return NextResponse.json({message:`${user.name} has been approved.`})}
