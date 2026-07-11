import { Schema, model, models, type InferSchemaType } from "mongoose";

const visibility = { type: String, enum: ["private","admins","members","public"], default: "members" };
const memberProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true, index: true }, nickname: { type: String, trim: true, index: true },
  profileImage: String, house: { type: String, index: true }, classArm: String,
  graduationYear: { type: Number, default: 2012, index: true },
  occupation: { type: String, index: true }, industry: String, employer: String, bio: String,
  city: String, region: String, country: { type: String, index: true },
  phone: String, whatsapp: String, website: String, birthday: String,
  socialLinks: { linkedin: String, instagram: String, facebook: String, x: String },
  visibility: { email: visibility, phone: visibility, location: visibility, occupation: visibility, birthday: { ...visibility, default: "private" }, profile: visibility },
  profileComplete: { type: Boolean, default: false }, approvedAt: Date, approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

memberProfileSchema.index({ fullName: "text", nickname: "text", occupation: "text", city: "text", country: "text" });
export type MemberProfileDocument = InferSchemaType<typeof memberProfileSchema>;
export const MemberProfile = models.MemberProfile || model("MemberProfile", memberProfileSchema);
