import express from "express";
import { AuthController } from "../controllers/auth/AuthController";
import { auth, adminMiddleware, requireVerified } from "../middleware/auth";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);
router.get("/login-status", AuthController.userLoginStatus);

router.get("/users/profile", auth, AuthController.getUser);
router.put("/updateUser", auth, AuthController.updateUser);
router.put("/password", auth, AuthController.changePassword);

router.get("/admin/users", auth, requireVerified, AuthController.getUser);
router.delete(
  "/admin/users/:id",
  auth,
  adminMiddleware,
  AuthController.getUser
);

router.get("/verify/:verificationToken", AuthController.verifyUser);
router.post("/verify-email", auth, AuthController.verifyEmail);
router.post("/forgot-password", AuthController.forgotPassword);
router.put("/reset-password/:resetPasswordToken", AuthController.resetPassword);
router.put("/Deactive-account", auth, AuthController.deactivateAccount);
router.put("/active-account", auth, AuthController.activateAccount);

export default router;
