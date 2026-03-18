// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const normalizedEmail = email.toLowerCase().trim()
  console.log('Normalized email:', normalizedEmail)

  const user = await User.findOne({ email: normalizedEmail });

  console.log(user);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 400 }
    );
  }

  const isMatch = password === user.password;

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 400 }
    );
  }

  const token = generateToken({
    userId: user._id,
    role: "Admin",
  });

  return NextResponse.json({
    message: "Login successful",
    token,
    user,
  });
}