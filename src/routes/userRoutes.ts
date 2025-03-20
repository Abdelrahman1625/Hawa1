import express from "express";
import { UserController } from "../controllers/user/userController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth, UserController.getAllUsers);
router.get("/:id", auth, UserController.getUserById);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/:id", auth, UserController.updateUser);
router.delete("/:id", auth, UserController.deleteUser);

export default router;
