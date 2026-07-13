import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  nickname: { type: String, trim: true },
  house: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, select: false },
  roles: { type: [String], enum: ["member","editor","moderator","admin","super_admin"], default: ["member"] },
  status: { type: String, enum: ["pending","verified","suspended","memorial"], default: "pending", index: true },
  emailVerifiedAt: Date,
  approvedAt: Date,
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  lastLoginAt: Date,
}, { timestamps: true });

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = models.User || model("User", userSchema);
