import { AuditLog } from "@/models/AuditLog";
import { NotificationJob } from "@/models/NotificationJob";

export async function recordPublication({actorId,action,entityType,entity,notify=false}:{actorId:string;action:string;entityType:"announcement"|"event";entity:any;notify?:boolean}) {
  await AuditLog.create({actorId,action,targetType:entityType,targetId:String(entity._id),metadata:{status:entity.status,audience:entity.audience||entity.visibility,title:entity.title}});
  if (!notify) return;
  const kind = entityType === "announcement" ? "announcement_published" : action === "event.cancelled" ? "event_cancelled" : action === "event.updated" ? "event_updated" : "event_published";
  const scheduledFor = entity.status === "scheduled" ? entity.publishAt || new Date() : new Date();
  const payload = {kind,audience:entity.audience||entity.visibility,entityType,entityId:entity._id,subject:entity.title,preview:entity.summary,status:"pending",scheduledFor,createdBy:actorId};
  if (["event_updated","event_cancelled"].includes(kind)) await NotificationJob.create(payload);
  else if (["published","scheduled"].includes(entity.status)) {
    await NotificationJob.updateOne({entityType,entityId:entity._id,kind,status:"pending"},{$setOnInsert:payload},{upsert:true});
    if (entityType === "event" && entity.startAt && new Date(entity.startAt).getTime() > Date.now() + 86400000) {
      await NotificationJob.updateOne({entityType:"event",entityId:entity._id,kind:"event_reminder",status:"pending"},{$setOnInsert:{kind:"event_reminder",audience:entity.visibility,entityType:"event",entityId:entity._id,subject:`Reminder: ${entity.title}`,preview:entity.summary,status:"pending",scheduledFor:new Date(new Date(entity.startAt).getTime()-86400000),createdBy:actorId}},{upsert:true});
    }
  }
}
