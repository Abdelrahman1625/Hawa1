import express, { RequestHandler } from "express";
import { AuthController } from "../controllers/auth/AuthController";

const router = express.Router();

// Auth routes
router.post("/register", AuthController.register as RequestHandler);
router.post("/login", AuthController.login as RequestHandler);

export default router;
