// models/City.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
  state: string;
  country: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  state: String,
  country: String,
});

export default mongoose.models.City ||
  mongoose.model<ICity>("City", CitySchema);