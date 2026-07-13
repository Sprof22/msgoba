import { Schema, model, models } from "mongoose";
const schema=new Schema({actorId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},action:{type:String,required:true,index:true},targetType:{type:String,required:true},targetId:{type:String,required:true,index:true},metadata:{type:Schema.Types.Mixed},ipAddress:String},{timestamps:true});
schema.index({createdAt:-1});
export const AuditLog=models.AuditLog||model("AuditLog",schema);
