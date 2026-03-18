// types/property.ts

export interface Property {
  _id: string; // Frontend uses string for IDs
  title: string;
  slug: string;
  description: string;

  // Basic
  purpose: "sell" | "rent" | "pg";
  propertyType: "residential" | "commercial";
  category: string;

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
  cityId: string; // Frontend uses string
  areaId: string; // Frontend uses string
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
  societyFeatures: string[];

  // Additional
  parking: {
    covered: number;
    open: number;
  };
  powerBackup: "none" | "partial" | "full";
  facing: string;
  flooring: string;
  roadWidth: number;

  // Posting Info
  postedBy: {
    type: "agent" | "builder" | "user";
    id: string;
  };

  isFeatured: boolean;
  views: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}