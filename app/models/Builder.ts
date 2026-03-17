// models/Builder.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBuilder extends Document {
  name: string;
  description: string;
  reraNumber: string;
}

const BuilderSchema = new Schema<IBuilder>(
  {
    name: { type: String, required: true },
    description: String,
    reraNumber: String,
  },
  { timestamps: true }
);

export default mongoose.models.Builder ||
  mongoose.model<IBuilder>("Builder", BuilderSchema);