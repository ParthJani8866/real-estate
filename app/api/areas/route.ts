// app/api/areas/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Area from "../../models/Area";

export async function GET() {
  await connectDB();
  const areas = await Area.find().populate("cityId");
  return NextResponse.json(areas);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const area = await Area.create(body);

  return NextResponse.json(area);
}