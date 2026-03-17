// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password } = await req.json();

  // check existing
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return NextResponse.json({
    message: "User created successfully",
    user,
  });
}