// app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { adminMiddleware } from "../../../lib/adminMiddleware";
import User from "../../../models/User";

export async function GET(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();

  const users = await User.find();

  return NextResponse.json(users);
}

export async function DELETE(req: Request) {
  const admin = adminMiddleware(req);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await connectDB();

  await User.findByIdAndDelete(id);

  return NextResponse.json({ message: "User deleted" });
}