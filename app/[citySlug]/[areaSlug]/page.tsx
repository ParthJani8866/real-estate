import { notFound } from "next/navigation";
import { connectDB } from "../../lib/mongodb";
import City from "../../models/City";
import Area from "../../models/Area";
import Property from "../../models/Property";
import AreaPropertiesClient from "@/app/components/AreaPropertiesClient";

export default async function AreaPage({ params }: { params: Promise<{ citySlug: string; areaSlug: string }> }) {
  const { citySlug, areaSlug } = await params;
  await connectDB();

  // Find city
  const city = await City.findOne({ slug: citySlug }).lean();
  if (!city) notFound();

  // Find area belonging to that city
  const area = await Area.findOne({ slug: areaSlug, cityId: city._id }).lean();
  if (!area) notFound();

  // Find all properties in this area
  const properties = await Property.find({ areaId: area._id })
    .populate("cityId", "name slug")
    .populate("areaId", "name slug")
    .lean();

  const serializedArea = { ...area, _id: area._id.toString() };
  const serializedProperties = properties.map(p => ({
    ...p,
    _id: p._id.toString(),
    cityId: p.cityId ? { _id: p.cityId._id.toString(), name: p.cityId.name, slug: p.cityId.slug } : null,
    areaId: p.areaId ? { _id: p.areaId._id.toString(), name: p.areaId.name, slug: p.areaId.slug } : null,
  }));

  return <AreaPropertiesClient area={serializedArea} properties={serializedProperties} />;
}