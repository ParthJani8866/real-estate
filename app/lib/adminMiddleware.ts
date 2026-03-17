// lib/adminMiddleware.ts

import { verifyToken } from "./auth";

export function adminMiddleware(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  const user: any = verifyToken(token);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}