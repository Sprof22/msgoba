import { Schema, model, models, type InferSchemaType } from "mongoose";

const legacyBrotherSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        place: { type: String, required: true, trim: true },
        photo: String,
        photoPublicId: String,
        order: { type: Number, default: 0, index: true },
        active: { type: Boolean, default: true, index: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
);

legacyBrotherSchema.index({ active: 1, order: 1, updatedAt: -1 });

export type LegacyBrotherDocument = InferSchemaType<typeof legacyBrotherSchema>;
export const LegacyBrother =
    models.LegacyBrother || model("LegacyBrother", legacyBrotherSchema);
