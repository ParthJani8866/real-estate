// app/api/properties/protected/route.ts

import { NextResponse } from "next/server";
import { authMiddleware } from "../../../lib/middleware";

export async function GET(req: Request) {
  const user = authMiddleware(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "You are authorized",
    user,
  });
}