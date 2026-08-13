import { Schema, model, models, type InferSchemaType } from "mongoose";

const prefectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    post: { type: String, required: true, trim: true },
    photo: String,
    photoPublicId: String,
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

prefectSchema.index({ active: 1, order: 1, updatedAt: -1 });

export type PrefectDocument = InferSchemaType<typeof prefectSchema>;
export const Prefect = models.Prefect || model("Prefect", prefectSchema);
