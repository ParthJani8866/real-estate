import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import City from "../../models/City";

export async function GET() {
  await connectDB();

  const cities = await City.find();

  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  const body = await req.json();

  await connectDB();

  const city = await City.create(body);

  return NextResponse.json(city);
}