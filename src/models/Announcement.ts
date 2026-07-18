import { Schema, model, models } from "mongoose";
const schema = new Schema({
  title:{type:String,required:true,trim:true}, slug:{type:String,required:true,unique:true,index:true}, summary:{type:String,required:true,trim:true}, body:{type:String,required:true},
  coverImage:String, coverImagePublicId:String, attachments:[{name:String,url:String,publicId:String,format:String,bytes:Number}],
  category:{type:String,enum:["general","welfare","reunion","executive","community","business","memorial"],default:"general",index:true},
  audience:{type:String,enum:["public","members","admins"],default:"members",index:true},
  status:{type:String,enum:["draft","review","scheduled","published","archived"],default:"draft",index:true},
  featured:{type:Boolean,default:false,index:true}, pinned:{type:Boolean,default:false,index:true},
  authorId:{type:Schema.Types.ObjectId,ref:"User",required:true}, lastEditorId:{type:Schema.Types.ObjectId,ref:"User"}, publishedBy:{type:Schema.Types.ObjectId,ref:"User"},
  publishAt:{type:Date,index:true}, publishedAt:Date, expiresAt:{type:Date,index:true}, viewCount:{type:Number,default:0},
},{timestamps:true});
schema.index({status:1,audience:1,publishAt:-1});
export const Announcement=models.Announcement||model("Announcement",schema);
