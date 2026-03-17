// app/api/admin/properties/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { adminMiddleware } from "../../../lib/adminMiddleware";
import Property from "../../../models/Property";

export async function GET(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const properties = await Property.find()
    .populate("cityId")
    .populate("areaId");

  return NextResponse.json(properties);
}

export async function DELETE(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await connectDB();

  await Property.findByIdAndDelete(id);

  return NextResponse.json({ message: "Property deleted" });
}