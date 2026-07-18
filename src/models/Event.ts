import { Schema, model, models } from "mongoose";
const schema = new Schema({
  title:{type:String,required:true,trim:true},slug:{type:String,required:true,unique:true,index:true},summary:{type:String,required:true},description:{type:String,required:true},
  coverImage:String,coverImagePublicId:String,startAt:{type:Date,required:true,index:true},endAt:Date,timezone:{type:String,default:"Africa/Lagos"},
  venue:String,mapUrl:String,agenda:String,dressCode:String,contactEmail:String,capacity:Number,allowGuests:{type:Boolean,default:false},maxGuests:{type:Number,default:0},
  visibility:{type:String,enum:["public","members","admins"],default:"members",index:true},
  status:{type:String,enum:["draft","review","scheduled","published","cancelled","completed","archived"],default:"draft",index:true},featured:{type:Boolean,default:false},
  organiserId:{type:Schema.Types.ObjectId,ref:"User",required:true},lastEditorId:{type:Schema.Types.ObjectId,ref:"User"},publishedBy:{type:Schema.Types.ObjectId,ref:"User"},publishAt:Date,publishedAt:Date,
},{timestamps:true});
schema.index({status:1,visibility:1,startAt:1});
export const Event=models.Event||model("Event",schema);
