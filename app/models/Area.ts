// models/Area.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
  name: string;
  cityId: mongoose.Types.ObjectId;
  pincode: string;
}

const AreaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  cityId: { type: Schema.Types.ObjectId, ref: "City" },
  pincode: String,
});

export default mongoose.models.Area ||
  mongoose.model<IArea>("Area", AreaSchema);