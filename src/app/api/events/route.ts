import { NextRequest,NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues,liveEventFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { Rsvp } from "@/models/Rsvp";
export async function GET(request:NextRequest){const viewer=await getCurrentUser();await connectToDatabase();const past=request.nextUrl.searchParams.get("past")==="1",filter:any=liveEventFilter(audienceValues(viewer));filter.startAt=past?{$lt:new Date()}:{$gte:new Date()};const events=await Event.find(filter).sort({featured:-1,startAt:1}).limit(50).lean() as any[];const ids=events.map(e=>e._id),counts=await Rsvp.aggregate([{$match:{eventId:{$in:ids},response:"attending"}},{$group:{_id:"$eventId",attending:{$sum:1},guests:{$sum:"$guestCount"}}}]);const map=new Map(counts.map(c=>[String(c._id),c.attending+c.guests]));return NextResponse.json({events:events.map(e=>({...e,attendeeCount:map.get(String(e._id))||0}))})}
