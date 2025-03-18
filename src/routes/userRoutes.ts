import express, { RequestHandler } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const userController = new UserController();

// Static methods
router.get("/", authMiddleware, UserController.getAllUsers as RequestHandler);
router.get(
  "/:id",
  authMiddleware,
  UserController.getUserById as RequestHandler
);
router.delete(
  "/:id",
  authMiddleware,
  UserController.deleteUser as RequestHandler
);

// Instance methods
router.post(
  "/register",
  userController.register.bind(userController) as RequestHandler
);
router.post(
  "/login",
  userController.login.bind(userController) as RequestHandler
);
router.put(
  "/:id",
  authMiddleware,
  userController.updateUser.bind(userController) as RequestHandler
);

export default router;
