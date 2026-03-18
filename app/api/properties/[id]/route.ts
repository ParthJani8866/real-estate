import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Property from "../../../models/Property";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("🔍 API received ID:", id);
    console.log("📏 ID length:", id.length);
    console.log("🔢 Is valid ObjectId?", mongoose.Types.ObjectId.isValid(id));

    await connectDB();
    console.log("✅ Database connected");

    // Try findById
    let property = await Property.findById(id).lean();
    console.log("📦 findById result:", property ? "Found" : "Not found");

    // If not found, try with explicit ObjectId
    if (!property && mongoose.Types.ObjectId.isValid(id)) {
      const objectId = new mongoose.Types.ObjectId(id);
      property = await Property.findOne({ _id: objectId }).lean();
      console.log("🔁 findOne with ObjectId result:", property ? "Found" : "Not found");
    }

    // If still not found, try as string (in case _id is stored as string)
    if (!property) {
      property = await Property.findOne({ _id: id }).lean();
      console.log("🔁 findOne with string result:", property ? "Found" : "Not found");
    }

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Serialize for frontend
    const serialized = {
      ...property,
      _id: property._id.toString(),
      cityId: property.cityId
        ? typeof property.cityId === "object"
          ? { _id: property.cityId._id.toString(), name: property.cityId.name }
          : property.cityId
        : null,
      areaId: property.areaId
        ? typeof property.areaId === "object"
          ? { _id: property.areaId._id.toString(), name: property.areaId.name }
          : property.areaId
        : null,
    };

    return NextResponse.json({ property: serialized });
  } catch (error) {
    console.error("🔥 Error in API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}