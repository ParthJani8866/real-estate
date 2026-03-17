// app/api/admin/dashboard/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { adminMiddleware } from "../../../lib/adminMiddleware";

import User from "../../../models/User";
import Property from "../../../models/Property";
import City from "../../../models/City";

export async function GET(req: Request) {
  const admin = adminMiddleware(req);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const users = await User.countDocuments();
  const properties = await Property.countDocuments();
  const cities = await City.countDocuments();

  return NextResponse.json({
    users,
    properties,
    cities,
  });
}