// app/api/builders/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Builder from "../../models/Builder";

export async function GET() {
  await connectDB();
  const builders = await Builder.find();
  return NextResponse.json(builders);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const builder = await Builder.create(body);

  return NextResponse.json(builder);
}