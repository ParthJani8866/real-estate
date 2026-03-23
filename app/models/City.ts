// models/City.ts

import mongoose, { Schema, Document } from "mongoose";
import { toKebabCase } from "../lib/slugParser";

export interface ICity extends Document {
  name: string;
  slug?: string;
  state: string;
  country: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  slug: { type: String },
  state: String,
  country: String,
});

CitySchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = toKebabCase(this.name);
});

CitySchema.index({ slug: 1 }, { unique: true, sparse: true });

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);
