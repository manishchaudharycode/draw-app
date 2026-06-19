import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const path = req.path;

  if (path.includes("/signin") || path.includes("/signup")) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      msg: "Token required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      id: string;
    };

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};