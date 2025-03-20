import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../core/Models/User";

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables!");
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided or invalid format" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    // Log the token for debugging
    console.log("Token:", token);
    console.log("Received Token in Request:", token);

    // Verify the token
    const secretKey = process.env.JWT_SECRET || "your-default-secret"; // Ensure this matches the signing key
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    // Log the decoded payload for debugging
    console.log("Decoded Payload:", decoded);
    console.log("Decoded Token Data:", decoded);

    const user = await UserModel.findById(decoded.userId).select(
      "-password_hash"
    );

    if (!user) {
      console.error(`User not found for userId: ${decoded.userId}`);
      console.error(
        "Possible reasons: User does not exist in the database or the token is invalid."
      );
      res
        .status(401)
        .json({ message: "User not found. Please check your token." });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ message: "User account is disabled" });
      return;
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Auth Middleware Error:", error.message);
    } else {
      console.error("Auth Middleware Error: Unknown error occurred");
    }
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.user_type !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  return next();
};

export const requireVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.is_verified) {
    res.status(403).json({ message: "User email is not verified." });
    return;
  }
  return next();
};
