import { notFound } from "next/navigation";
import { connectDB } from "../lib/mongodb";
import City from "../models/City";
import Property from "../models/Property";
import CityPropertiesClient from "@/app/components/CityPropertiesClient";

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  await connectDB();

  // Find city by slug
  const city = await City.findOne({ slug: citySlug }).lean();
  if (!city) notFound();

  // Find all properties in this city, populate area info
  const properties = await Property.find({ cityId: city._id })
    .populate("areaId", "name slug")
    .lean();

  // Serialize MongoDB objects for client
  const serializedCity = { ...city, _id: city._id.toString() };
  const serializedProperties = properties.map(p => ({
    ...p,
    _id: p._id.toString(),
    cityId: p.cityId?.toString(),
    areaId: p.areaId ? { _id: p.areaId._id.toString(), name: p.areaId.name, slug: p.areaId.slug } : null,
  }));

  return <CityPropertiesClient city={serializedCity} properties={serializedProperties} />;
}