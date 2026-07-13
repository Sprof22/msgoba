import { Schema, model, models, type InferSchemaType } from "mongoose";

const visibility = { type: String, enum: ["private","admins","members","public"], default: "members" };
const memberProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true, index: true }, nickname: { type: String, trim: true, index: true },
  profileImage: String, profileImagePublicId: String, house: { type: String, index: true }, classArm: String,
  graduationYear: { type: Number, default: 2012, index: true },
  occupation: { type: String, index: true }, industry: String, employer: String, professionalSummary: String, bio: String,
  skills: [String], education: [{ institution: String, qualification: String, year: String }], achievements: [String],
  business: { name: String, description: String, website: String }, schoolMemory: String, interests: [String],
  city: String, region: String, country: { type: String, index: true },
  phone: String, whatsapp: String, website: String, birthday: String,
  socialLinks: { linkedin: String, instagram: String, facebook: String, x: String },
  visibility: { email: { ...visibility, default: "private" }, phone: { ...visibility, default: "private" }, whatsapp: { ...visibility, default: "private" }, location: visibility, occupation: visibility, employer: { ...visibility, default: "members" }, birthday: { ...visibility, default: "private" }, socialLinks: { ...visibility, default: "members" }, business: { ...visibility, default: "members" }, education: visibility, achievements: visibility, profile: visibility },
  profileComplete: { type: Boolean, default: false }, completionScore: { type: Number, default: 0 },
  moderationStatus: { type: String, enum: ["visible","hidden","changes_requested","memorial"], default: "visible", index: true },
  moderationNote: String, moderatedAt: Date, moderatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedAt: Date, approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

memberProfileSchema.index({ fullName: "text", nickname: "text", occupation: "text", city: "text", country: "text" });
export type MemberProfileDocument = InferSchemaType<typeof memberProfileSchema>;
export const MemberProfile = models.MemberProfile || model("MemberProfile", memberProfileSchema);
