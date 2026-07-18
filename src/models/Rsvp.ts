import { Schema, model, models } from "mongoose";
const schema=new Schema({eventId:{type:Schema.Types.ObjectId,ref:"Event",required:true,index:true},userId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},response:{type:String,enum:["attending","maybe","declined"],required:true},guestCount:{type:Number,min:0,default:0},guestNames:[String],note:{type:String,maxlength:500},respondedAt:{type:Date,default:Date.now}},{timestamps:true});
schema.index({eventId:1,userId:1},{unique:true});
export const Rsvp=models.Rsvp||model("Rsvp",schema);
