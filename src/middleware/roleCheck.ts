import { Request, Response, NextFunction } from "express";
import { UserModel } from "../core/Models/User";

// Define the UserType interface
interface UserType {
  id: string;
  user_type: string;
  account_status?: string;
  is_active?: boolean;
}

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    try {
      const user: UserType | null = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      if (!roles.includes(user.user_type)) {
        return res.status(403).json({
          error: "Access denied. Insufficient permissions",
        });
      }

      // Add role-specific checks
      if (user.user_type === "driver" && user.account_status !== "active") {
        return res.status(403).json({
          error: "Driver account is not active",
        });
      }

      if (user.user_type === "admin" && !user.is_active) {
        return res.status(403).json({
          error: "Admin account is inactive",
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        error: "Role verification failed",
        details: error.message,
      });
    }
  };
};

// Specific role check middlewares
export const isCustomer = checkRole(["customer"]);
export const isDriver = checkRole(["driver"]);
export const isAdmin = checkRole(["admin"]);
export const isAdminOrDriver = checkRole(["admin", "driver"]);
