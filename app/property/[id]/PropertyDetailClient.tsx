"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  Calendar,
  Zap,
  Car,
  Wifi,
  Shield,
  Droplets,
  TreePine,
  Tv,
  Wind,
  Snowflake,
  Flame,
  Coffee,
  Utensils,
  Key,
  Lock,
  Phone,
  Mail,
  Star,
  Video,
  User,
  X,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  bhk: number;
  bathrooms: number;
  balconies: number;
  areaSqft: number;
  builtUpArea?: number;
  carpetArea?: number;
  purpose: "sell" | "rent" | "pg";
  availabilityStatus: "ready_to_move" | "under_construction";
  furnishing: "furnished" | "semi-furnished" | "unfurnished";
  cityId: { _id: string; name: string } | string | null;
  areaId: { _id: string; name: string } | string | null;
  address?: string;
  images: string[];
  videos: string[];
  amenities: string[];
  features: string[];
  societyFeatures: string[];
  parking: { covered: number; open: number };
  powerBackup: "none" | "partial" | "full";
  facing: string;
  flooring: string;
  roadWidth: number;
  totalFloors?: number;
  floorNumber?: number;
}

// Helper to get YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Map amenity/feature names to icons
const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return <Wifi size={18} />;
  if (lower.includes("parking")) return <Car size={18} />;
  if (lower.includes("security") || lower.includes("cctv")) return <Shield size={18} />;
  if (lower.includes("pool")) return <Droplets size={18} />;
  if (lower.includes("gym")) return <Zap size={18} />; // placeholder
  if (lower.includes("garden") || lower.includes("park")) return <TreePine size={18} />;
  if (lower.includes("ac") || lower.includes("air conditioning")) return <Snowflake size={18} />;
  if (lower.includes("heater") || lower.includes("geyser")) return <Flame size={18} />;
  if (lower.includes("kitchen") || lower.includes("modular")) return <Utensils size={18} />;
  if (lower.includes("tv")) return <Tv size={18} />;
  if (lower.includes("coffee")) return <Coffee size={18} />;
  if (lower.includes("key") || lower.includes("lock")) return <Key size={18} />;
  return <Check size={18} />; // default
};

export default function PropertyDetailClient({ property }: { property: Property }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  const getLocationText = () => {
    const parts = [];

    if (property.areaId && typeof property.areaId === "object") parts.push(property.areaId.name);
    if (property.cityId && typeof property.cityId === "object") parts.push(property.cityId.name);
    return parts.join(", ") || "Location not specified";
  };

  const getPurposeText = () => {
    switch (property.purpose) {
      case "sell": return "For Sale";
      case "rent": return "For Rent";
      case "pg": return "PG Accommodation";
      default: return "";
    }
  };

  // Get first valid YouTube video
  const youtubeId = property.videos?.map(v => getYouTubeId(v)).find(id => id !== null);

  // Truncate description
  const truncatedDescription =
    property.description.length > 50
      ? property.description.slice(0, 50) + "..."
      : property.description;

  const agent = {
    name: "Parth Jani",
    phone: "8866398281",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96 md:h-[500px]">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>
          {property.images && property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-blue-600" : "border-transparent"
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title and Basic Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getPurposeText()}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {property.availabilityStatus === "ready_to_move" ? "Ready to Move" : "Under Construction"}
            </span>
          </div>
        </div>

        {/* Price and Key Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            <p className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Area</h3>
            <p className="text-2xl font-bold">
              {property.areaSqft || property.builtUpArea || property.carpetArea || "N/A"} sq.ft.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Floor</h3>
            <p className="text-2xl font-bold">
              {property.floorNumber ? `Floor ${property.floorNumber}` : "N/A"}
              {property.totalFloors ? ` of ${property.totalFloors}` : ""}
            </p>
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Room Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Bed className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="text-xl font-bold">{property.bhk} BHK</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Bath className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="text-xl font-bold">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Maximize className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Balconies</p>
                <p className="text-xl font-bold">{property.balconies}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Home className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Furnishing</p>
                <p className="text-xl font-bold capitalize">{property.furnishing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tour Section */}
        {youtubeId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Video className="text-blue-600" /> Video Tour
            </h2>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Property Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {expanded ? property.description : truncatedDescription}
          </p>
          {property.description.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-blue-600">{getAmenityIcon(item)}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-green-600">{getAmenityIcon(item)}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Society Features */}
        {property.societyFeatures && property.societyFeatures.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Society/Building Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.societyFeatures.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="text-purple-600">{getAmenityIcon(item)}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.parking && (
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Car size={16} /> Parking</p>
                <p className="font-medium">Covered: {property.parking.covered}, Open: {property.parking.open}</p>
              </div>
            )}
            {property.powerBackup && property.powerBackup !== "none" && (
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Zap size={16} /> Power Backup</p>
                <p className="font-medium capitalize">{property.powerBackup}</p>
              </div>
            )}
            {property.facing && (
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Home size={16} /> Facing</p>
                <p className="font-medium">{property.facing}</p>
              </div>
            )}
            {property.flooring && (
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Maximize size={16} /> Flooring</p>
                <p className="font-medium">{property.flooring}</p>
              </div>
            )}
            {property.roadWidth > 0 && (
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={16} /> Road Width</p>
                <p className="font-medium">{property.roadWidth} feet</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sticky bottom-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Interested in this property?</h3>
              <p className="text-gray-500">Contact the agent for more details</p>
            </div>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
            >
              <Phone size={18} /> Contact Agent
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{agent.name}</h3>
              <p className="text-gray-500 mb-6">Property Agent</p>
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-blue-600" />
                  <span className="text-lg font-semibold">{agent.phone}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Call or WhatsApp for more details about this property.
              </p>
              <button
                onClick={() => window.location.href = `tel:${agent.phone}`}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Call Now
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="mt-3 w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      )}
      <Footer></Footer>
    </div>
  );
}