import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Property from "../../../models/Property";

export async function GET(_: Request, { params }: any) {
  await connectDB();

  const property = await Property.findById(params.id);

  return NextResponse.json(property);
}

export async function DELETE(_: Request, { params }: any) {
  await connectDB();

  await Property.findByIdAndDelete(params.id);

  return NextResponse.json({ message: "Deleted" });
}