import { Schema, model, models } from "mongoose";

const galleryPhotoSchema = new Schema({
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  caption: { type: String, required: true, trim: true },
  album: { type: String, required: true, trim: true, index: true },
  takenAt: Date,
  credit: { type: String, trim: true },
  active: { type: Boolean, default: true, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

galleryPhotoSchema.index({ active: 1, album: 1, takenAt: -1, createdAt: -1 });
export const GalleryPhoto = models.GalleryPhoto || model("GalleryPhoto", galleryPhotoSchema);
