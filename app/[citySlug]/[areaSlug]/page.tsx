import { notFound } from "next/navigation";
import { connectDB } from "../../lib/mongodb";
import City from "../../models/City";
import Area from "../../models/Area";
import Property from "../../models/Property";
import AreaPropertiesClient from "@/app/components/AreaPropertiesClient";
import { toKebabCase } from "../../lib/slugParser";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugToName(slug: string) {
  return slug.replace(/-/g, " ").trim();
}

export default async function AreaPage({ params }: { params: { citySlug: string; areaSlug: string } }) {
  const { citySlug, areaSlug } = params;
  await connectDB();

  // Find city
  const city = await City.findOne({
    $or: [
      { slug: citySlug },
      { name: { $regex: new RegExp(`^${escapeRegex(slugToName(citySlug))}$`, "i") } },
    ],
  }).lean();
  if (!city) notFound();

  // Find area belonging to that city
  const area = await Area.findOne({
    cityId: city._id,
    $or: [
      { slug: areaSlug },
      { name: { $regex: new RegExp(`^${escapeRegex(slugToName(areaSlug))}$`, "i") } },
    ],
  }).lean();
  if (!area) notFound();

  // Find all properties in this area
  const properties = await Property.find({ areaId: area._id })
    .populate("cityId", "name slug")
    .populate("areaId", "name slug")
    .lean();

  const serializedArea = { ...area, _id: area._id.toString(), slug: area.slug || toKebabCase(area.name) };
  const serializedProperties = properties.map(p => ({
    ...p,
    _id: p._id.toString(),
    cityId: p.cityId ? { _id: p.cityId._id.toString(), name: p.cityId.name, slug: p.cityId.slug || toKebabCase(p.cityId.name) } : null,
    areaId: p.areaId ? { _id: p.areaId._id.toString(), name: p.areaId.name, slug: p.areaId.slug || toKebabCase(p.areaId.name) } : null,
  }));

  return <AreaPropertiesClient area={serializedArea} properties={serializedProperties} />;
}
