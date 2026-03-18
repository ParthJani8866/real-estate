// app/api/properties/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Property from "../../models/Property";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const area = searchParams.get("area");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bhk = searchParams.get("bhk");

  let filter: any = {};

  if (city) filter.cityId = city;
  if (area) filter.areaId = area;
  if (bhk) filter.bhk = Number(bhk);

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const properties = await Property.find(filter)
    .populate("cityId")
    .populate("areaId")
    .sort({ createdAt: -1 });

  return NextResponse.json(properties);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  console.log(body);
  // basic slug generator
  body.slug = body.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  const property = await Property.create(body);
  console.log(property);

  return NextResponse.json(property);
}