import { Request, Response, NextFunction } from "express";

interface ValidationError extends Error {
  errors: Record<string, { message: string }>;
}

interface DuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, any>;
}

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: ValidationError | DuplicateKeyError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error(err.stack);

  // Handle different types of errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Validation Error",
      details: Object.values((err as ValidationError).errors).map(
        (error) => error.message
      ),
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      error: "Invalid token",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      error: "Token expired",
    });
    return;
  }

  if ((err as DuplicateKeyError).code === 11000) {
    res.status(409).json({
      error: "Duplicate key error",
      details: (err as DuplicateKeyError).keyValue,
    });
    return;
  }

  // Default error
  res.status((err as CustomError).status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async error wrapper
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
