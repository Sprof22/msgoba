import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues,liveEventFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { Rsvp } from "@/models/Rsvp";
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){const viewer=await getCurrentUser(),{slug}=await params;await connectToDatabase();const event=await Event.findOne({...liveEventFilter(audienceValues(viewer)),slug}).lean() as any;if(!event)return NextResponse.json({error:"Event not found."},{status:404});const [stats,mine]=await Promise.all([Rsvp.aggregate([{$match:{eventId:event._id}},{$group:{_id:"$response",members:{$sum:1},guests:{$sum:"$guestCount"}}}]),viewer?Rsvp.findOne({eventId:event._id,userId:viewer.id}).lean():null]);return NextResponse.json({event,stats:Object.fromEntries(stats.map(s=>[s._id,{members:s.members,guests:s.guests}])),rsvp:mine})}
