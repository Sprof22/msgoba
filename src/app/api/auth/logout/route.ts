import { NextResponse } from "next/server";
import { assertSameOrigin, deleteSession } from "@/lib/auth";
export async function POST(request:Request){try{await assertSameOrigin(request);await deleteSession();return NextResponse.json({message:"Signed out."})}catch{return NextResponse.json({error:"Could not sign out."},{status:500})}}
