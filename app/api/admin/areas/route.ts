// app/api/admin/areas/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { adminMiddleware } from "../../../lib/adminMiddleware";
import Area from "../../../models/Area";

export async function GET(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const areas = await Area.find().populate("cityId");

  return NextResponse.json(areas);
}

export async function POST(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await connectDB();

  const area = await Area.create(body);

  return NextResponse.json(area);
}