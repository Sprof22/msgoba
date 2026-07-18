import { getCurrentUser,hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { Event } from "@/models/Event";
import { Rsvp } from "@/models/Rsvp";
const csv=(v:unknown)=>`"${String(v??"").replaceAll('"','""')}"`;
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const actor=await getCurrentUser();if(!hasAdminRole(actor))return new Response("Forbidden",{status:403});await connectToDatabase();const {id}=await params,event=await Event.findById(id);if(!event)return new Response("Event not found",{status:404});const rsvps=await Rsvp.find({eventId:id}).populate("userId","name email house").sort({response:1,createdAt:1}).lean() as any[];const rows=rsvps.map(r=>[r.userId?.name,r.userId?.email,r.userId?.house,r.response,r.guestCount,(r.guestNames||[]).join("; "),r.note,r.respondedAt?.toISOString()]);await AuditLog.create({actorId:actor!.id,action:"event.attendees_exported",targetType:"event",targetId:id,metadata:{records:rows.length}});const header=["Member","Email","House","Response","Guests","Guest names","Note","Responded at"];return new Response([header,...rows].map(r=>r.map(csv).join(",")).join("\n"),{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="${event.slug}-attendees.csv"`,"Cache-Control":"no-store"}})}
