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
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
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
  if (lower.includes("gym")) return <Zap size={18} />;
  if (lower.includes("garden") || lower.includes("park")) return <TreePine size={18} />;
  if (lower.includes("ac") || lower.includes("air conditioning")) return <Snowflake size={18} />;
  if (lower.includes("heater") || lower.includes("geyser")) return <Flame size={18} />;
  if (lower.includes("kitchen") || lower.includes("modular")) return <Utensils size={18} />;
  if (lower.includes("tv")) return <Tv size={18} />;
  if (lower.includes("coffee")) return <Coffee size={18} />;
  if (lower.includes("key") || lower.includes("lock")) return <Key size={18} />;
  return <Check size={18} />;
};

export default function PropertyDetailClient({ property }: { property: Property }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
    property.description.length > 150
      ? property.description.slice(0, 150) + "..."
      : property.description;

  const agent = {
    name: "Parth Jani",
    phone: "8866398281",
    email: "parthskyward@gmail.com",
    rating: 4.7,
    reviews: 127,
    image: "/agent-placeholder.jpg",
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back navigation (optional) */}
        <div className="mb-6">
          <Link href="/properties" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
            <ChevronLeft size={18} className="mr-1" />
            Back to listings
          </Link>
        </div>

        {/* Main grid: left column (content) + right sidebar (sticky contact) */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left column - main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Main image with navigation */}
              <div className="relative aspect-[16/9] bg-gray-200 dark:bg-gray-700">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[selectedImage]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${selectedImage === idx
                        ? "border-blue-600 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {property.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <Heart size={22} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"} />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <Share2 size={22} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {getPurposeText()}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${property.availabilityStatus === "ready_to_move"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                  }`}>
                  {property.availabilityStatus === "ready_to_move" ? "Ready to Move" : "Under Construction"}
                </span>
                {property.furnishing && (
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium capitalize">
                    {property.furnishing}
                  </span>
                )}
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(property.price)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {property.areaSqft || property.builtUpArea || property.carpetArea || "N/A"} sq.ft
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{property.bhk} BHK</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Floor</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {property.floorNumber ? property.floorNumber : "N/A"}
                  {property.totalFloors ? `/${property.totalFloors}` : ""}
                </p>
              </div>
            </div>

            {/* Room Details (expanded) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Room Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Bed className="text-blue-600 dark:text-blue-400" size={22} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bhk}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Bath className="text-blue-600 dark:text-blue-400" size={22} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Maximize className="text-blue-600 dark:text-blue-400" size={22} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Balconies</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.balconies}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Home className="text-blue-600 dark:text-blue-400" size={22} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Furnishing</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{property.furnishing}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Tour */}
            {youtubeId && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Video className="text-blue-600 dark:text-blue-400" /> Video Tour
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {expanded ? property.description : truncatedDescription}
              </p>
              {property.description.length > 150 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400">{getAmenityIcon(item)}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-green-600 dark:text-green-400">{getAmenityIcon(item)}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Society Features */}
            {property.societyFeatures && property.societyFeatures.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Society / Building Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.societyFeatures.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-purple-600 dark:text-purple-400">{getAmenityIcon(item)}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.parking && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Car size={14} /> Parking</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      Covered: {property.parking.covered}, Open: {property.parking.open}
                    </p>
                  </div>
                )}
                {property.powerBackup && property.powerBackup !== "none" && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Zap size={14} /> Power Backup</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 capitalize">{property.powerBackup}</p>
                  </div>
                )}
                {property.facing && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Home size={14} /> Facing</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{property.facing}</p>
                  </div>
                )}
                {property.flooring && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Maximize size={14} /> Flooring</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{property.flooring}</p>
                  </div>
                )}
                {property.roadWidth > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={14} /> Road Width</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{property.roadWidth} feet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Agent Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center overflow-hidden">

                    <User size={32} className="text-blue-600 dark:text-blue-400" />

                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>{agent.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{agent.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Contact Agent
                  </button>
                  <a
                    href={`mailto:${agent.email}`}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Send Email
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Property ID: {property._id.slice(-6)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Posted: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Quick Highlights Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Highlights</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Super built-up area: {property.builtUpArea || property.areaSqft || "N/A"} sq.ft</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Carpet area: {property.carpetArea || "N/A"} sq.ft</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Transaction type: {property.purpose === 'sell' ? 'Sale' : property.purpose === 'rent' ? 'Rent' : 'PG'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Availability: {property.availabilityStatus === 'ready_to_move' ? 'Ready to move' : 'Under construction'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative animate-fade-in-up">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{agent.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Property Agent</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{agent.rating}</span>
                <span className="text-gray-500 dark:text-gray-400">({agent.reviews} reviews)</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                    Phone
                  </span>
                  <a href={`tel:${agent.phone}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    {agent.phone}
                  </a>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                    Email
                  </span>
                  <a href={`mailto:${agent.email}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                    {agent.email}
                  </a>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Call or WhatsApp for more details about this property.
              </p>
              <button
                onClick={() => window.location.href = `tel:${agent.phone}`}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <Phone size={18} />
                Call Now
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full mt-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}