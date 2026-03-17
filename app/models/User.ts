// models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "agent" | "builder" | "admin";
  favorites: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "agent", "builder", "admin"],
      default: "user",
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);