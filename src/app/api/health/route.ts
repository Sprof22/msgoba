import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({status:"ok",service:"MSG Class of 2012",timestamp:new Date().toISOString()})}
