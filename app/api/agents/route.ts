// app/api/agents/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Agent from "../../models/Agent";

export async function GET() {
  await connectDB();
  const agents = await Agent.find().populate("userId");
  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const agent = await Agent.create(body);

  return NextResponse.json(agent);
}