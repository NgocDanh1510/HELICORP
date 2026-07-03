import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided", code: "NO_TOKEN" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is missing from environment variables");
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as { userId: string; email: string };
    
    req.user = {
      id: payload.userId,
      email: payload.email
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      return;
    }

    res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
  }
}
