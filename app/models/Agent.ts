// models/Agent.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  userId: mongoose.Types.ObjectId;
  agencyName: string;
  experience: number;
  reraNumber: string;
  areasCovered: mongoose.Types.ObjectId[];
  rating: number;
}

const AgentSchema = new Schema<IAgent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agencyName: String,
    experience: Number,
    reraNumber: String,
    areasCovered: [{ type: Schema.Types.ObjectId, ref: "Area" }],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema);