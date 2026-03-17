// models/Property.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  bhk: number;
  areaSqft: number;
  type: string;
  status: string;
  cityId: mongoose.Types.ObjectId;
  areaId: mongoose.Types.ObjectId;
  images: string[];
  amenities: string[];
  postedBy: {
    type: "agent" | "builder" | "user";
    id: mongoose.Types.ObjectId;
  };
  location: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  views: number;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    description: String,

    price: Number,
    bhk: Number,
    areaSqft: Number,

    type: String,
    status: { type: String, default: "available" },

    cityId: { type: Schema.Types.ObjectId, ref: "City" },
    areaId: { type: Schema.Types.ObjectId, ref: "Area" },

    images: [String],
    amenities: [String],

    postedBy: {
      type: {
        type: String,
        enum: ["agent", "builder", "user"],
      },
      id: { type: Schema.Types.ObjectId },
    },

    location: {
      lat: Number,
      lng: Number,
    },

    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes (VERY IMPORTANT)
PropertySchema.index({ slug: 1 });
PropertySchema.index({ cityId: 1, areaId: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ bhk: 1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);