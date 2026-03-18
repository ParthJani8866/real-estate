'use client'

import Link from "next/link";
import { MapPin, Bed, Maximize } from "lucide-react";

interface Property {
  _id: string;
  title: string;
  price: number;
  bhk: number;
  areaSqft: number;
  images: string[];
  slug?: string;
  areaId?: { name: string; slug: string };
}

export default function CityPropertiesClient({ city, properties }: { city: any; properties: Property[] }) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Properties in {city.name}</h1>
      <p className="text-gray-600 mb-8">{properties.length} properties found</p>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-300">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{property.title}</h3>
              <p className="text-blue-600 font-bold mt-1">{formatPrice(property.price)}</p>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1"><Bed size={16} /> {property.bhk} BHK</span>
                <span className="flex items-center gap-1"><Maximize size={16} /> {property.areaSqft} sqft</span>
              </div>
              {property.areaId && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin size={16} /> {property.areaId.name}
                </p>
              )}
              <Link
                href={`/${city.slug}/${property.areaId?.slug || 'area'}/${property.slug || property._id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}