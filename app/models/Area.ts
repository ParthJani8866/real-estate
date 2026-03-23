// models/Area.ts

import mongoose, { Schema, Document } from "mongoose";
import { toKebabCase } from "../lib/slugParser";

export interface IArea extends Document {
  name: string;
  slug?: string;
  cityId: mongoose.Types.ObjectId;
  pincode: string;
}

const AreaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  slug: { type: String },
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
  pincode: String,
});

AreaSchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = toKebabCase(this.name);
});

AreaSchema.index({ cityId: 1, slug: 1 }, { unique: true, sparse: true });

export default mongoose.models.Area ||
  mongoose.model<IArea>("Area", AreaSchema);
