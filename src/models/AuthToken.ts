import { Schema, model, models } from "mongoose";

const authTokenSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  purpose: { type: String, enum: ["verify_email", "reset_password"], required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  usedAt: Date,
}, { timestamps: true });

export const AuthToken = models.AuthToken || model("AuthToken", authTokenSchema);
