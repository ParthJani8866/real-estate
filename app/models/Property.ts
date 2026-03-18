// models/Property.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;

  // Basic
  purpose: "sell" | "rent" | "pg";
  propertyType: "residential" | "commercial";
  category: string; // flat, villa, plot etc

  // Pricing
  price: number;

  // Property Profile
  bhk: number;
  bathrooms: number;
  balconies: number;

  areaSqft: number;
  builtUpArea: number;
  carpetArea: number;

  totalFloors: number;
  floorNumber: number;

  furnishing: "furnished" | "semi-furnished" | "unfurnished";

  availabilityStatus: "ready_to_move" | "under_construction";

  // Location
  cityId: mongoose.Types.ObjectId;
  areaId: mongoose.Types.ObjectId;
  address: string;

  location: {
    lat: number;
    lng: number;
  };

  // Media
  images: string[];
  videos: string[];

  // Amenities
  amenities: string[];
  features: string[];

  // Society Features
  societyFeatures: string[];

  // Additional
  parking: {
    covered: number;
    open: number;
  };

  powerBackup: "none" | "partial" | "full";

  facing: string; // north, south etc
  flooring: string;
  roadWidth: number;

  // Posting Info
  postedBy: {
    type: "agent" | "builder" | "user";
    id: mongoose.Types.ObjectId;
  };

  isFeatured: boolean;
  views: number;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },

    description: String,

    // Basic
    purpose: {
      type: String,
      enum: ["sell", "rent", "pg"],
      default: "sell"
    },

    propertyType: {
      type: String,
      enum: ["residential", "commercial"],
      default: "residential"
    },

    category: String,

    // Pricing
    price: { type: Number, required: true },

    // Profile
    bhk: Number,
    bathrooms: Number,
    balconies: Number,

    areaSqft: Number,
    builtUpArea: Number,
    carpetArea: Number,

    totalFloors: Number,
    floorNumber: Number,

    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"]
    },

    availabilityStatus: {
      type: String,
      enum: ["ready_to_move", "under_construction"]
    },

    // Location
    cityId: { type: Schema.Types.ObjectId, ref: "City" },
    areaId: { type: Schema.Types.ObjectId, ref: "Area" },
    address: String,

    location: {
      lat: Number,
      lng: Number
    },

    // Media
    images: [String],
    videos: [String],

    // Amenities
    amenities: [String],
    features: [String],
    societyFeatures: [String],

    // Extra
    parking: {
      covered: { type: Number, default: 0 },
      open: { type: Number, default: 0 }
    },

    powerBackup: {
      type: String,
      enum: ["none", "partial", "full"]
    },

    facing: String,
    flooring: String,
    roadWidth: Number,

    // Posting
    postedBy: {
      type: {
        type: String,
        enum: ["agent", "builder", "user"]
      },
      id: { type: Schema.Types.ObjectId }
    },

    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

//
// 🔥 INDEXES (VERY IMPORTANT FOR PERFORMANCE)
//
PropertySchema.index({ slug: 1 });
PropertySchema.index({ cityId: 1, areaId: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ bhk: 1 });
PropertySchema.index({ purpose: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ category: 1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);