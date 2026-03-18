// lib/middleware.ts

import { verifyToken } from "./auth";

export function authMiddleware(req: Request) {
  const authHeader = req.headers.get("authorization");
  console.log(authHeader);
  
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  return verifyToken(token);
}