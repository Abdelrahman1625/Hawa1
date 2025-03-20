import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateUserCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("vehicle_info")
    .if(body("user_type").equals("driver"))
    .notEmpty()
    .withMessage("Vehicle information is required for drivers")
    .custom((value: unknown) => {
      if (typeof value !== "object" || Array.isArray(value) || value === null) {
        throw new Error("Vehicle information must be a non-null object");
      }
      return true;
    }),

  handleValidationResult,
];

export const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("vehicle_info")
    .optional()
    .custom((value: unknown, { req }: { req: Request }) => {
      if (req.user?.user_type === "driver") {
        if (!value) {
          throw new Error("Vehicle information is required for drivers");
        }
        if (
          typeof value !== "object" ||
          Array.isArray(value) ||
          value === null
        ) {
          throw new Error("Vehicle information must be a non-null object");
        }
      }
      return true;
    }),

  handleValidationResult,
];

export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  handleValidationResult,
];

export const validateRideRequest = [
  body("pickup_location")
    .notEmpty()
    .withMessage("Pickup location is required")
    .custom((value: any) => {
      if (
        !value ||
        typeof value !== "object" ||
        !("latitude" in value) ||
        !("longitude" in value)
      ) {
        throw new Error("Pickup location must include latitude and longitude");
      }
      return true;
    }),

  handleValidationResult,
];

export const validatePayment = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  handleValidationResult,
];

export const validateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  handleValidationResult,
];

export const validateAdminActions = [
  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["approve", "reject", "suspend", "activate"])
    .withMessage("Invalid action"),

  handleValidationResult,
];

export const validateRideStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["accepted", "started", "completed", "cancelled"])
    .withMessage("Invalid ride status"),

  handleValidationResult,
];

export const validatePaymentStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "completed", "failed", "refunded"])
    .withMessage("Invalid payment status"),

  handleValidationResult,
];
