import { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  userAgent: String,
  ipAddress: String,
  lastSeenAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Session = models.Session || model("Session", sessionSchema);
