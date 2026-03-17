// app/api/admin/cities/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { adminMiddleware } from "../../../lib/adminMiddleware";
import City from "../../../models/City";

export async function GET(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const cities = await City.find();

  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await connectDB();

  const city = await City.create(body);

  return NextResponse.json(city);
}