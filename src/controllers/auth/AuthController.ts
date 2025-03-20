import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserModel, IUser } from "../../core/Models/User";
import { Customer } from "../../core/Models/Customer";
import { Driver } from "../../core/Models/Driver";
import { Admin } from "../../core/Models/Admin";
import { TokenModel } from "../../core/Models/Token";
import { sendEmail } from "../../core/utils/email";
import hashToken from "../../core/utils/hashToken";

// Update IUser interface to include missing properties
declare module "../../core/Models/User" {
  interface IUser {
    isVerified: boolean; // Ensure this is not optional
    is_active: boolean; // Ensure this is not optional
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });
};

export class AuthController {
  static registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      phone,
      address,
      user_type,
      ...additionalInfo
    } = req.body;

    const existingUser = (await UserModel.findOne({
      $or: [{ email }, { phone }],
    })) as IUser | null;
    if (existingUser) {
      res
        .status(400)
        .json({ error: "User with this email or phone already exists" });
      return;
    }

    let user;
    const userData: Partial<IUser> = {
      name,
      email,
      password_hash: await bcrypt.hash(password, 10),
      phone,
      address,
      user_type,
    };

    switch (user_type) {
      case "customer":
        user = new Customer({
          ...userData,
          loyalty_points: 0,
          wallet_balance: 0,
        });
        break;
      case "driver":
        if (!additionalInfo.license_number || !additionalInfo.vehicle_info) {
          res.status(400).json({
            error:
              "License number and vehicle information are required for drivers",
          });
          return;
        }
        user = new Driver({
          ...userData,
          ...additionalInfo,
          account_status: "inactive",
        });
        break;
      case "admin":
        if (!additionalInfo.admin_level) {
          res.status(400).json({ error: "Admin level is required" });
          return;
        }
        user = new Admin({ ...userData, ...additionalInfo });
        break;
      default:
        res.status(400).json({ error: "Invalid user type" });
        return;
    }

    await user.save();
    const token = generateToken(user._id?.toString() || "");
    res
      .status(201)
      .json({ message: "User registered successfully", token, user });
  });

  static loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    const user = (await UserModel.findOne({ email })) as IUser | null;
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.is_active) {
      res.status(401).json({ message: "Account is disabled" });
      return;
    }

    const token = generateToken(user._id?.toString() || "");
    setTokenCookie(res, token);

    res.status(200).json({ message: "Login successful", token, user });
  });

  static userLoginStatus = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }

    try {
      jwt.verify(token, JWT_SECRET);
      res.status(200).json(true);
    } catch {
      res.status(401).json(false);
    }
  });

  static logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  });

  static getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = (await UserModel.findById(req.user?.userId).select(
      "-password_hash"
    )) as IUser | null;
    user
      ? res.status(200).json(user)
      : res.status(404).json({ message: "User not found" });
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = (await UserModel.findById(req.user?.userId)) as IUser | null;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    Object.assign(user, req.body);
    await user.save();
    res.status(200).json(user);
  });

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = (await UserModel.findById(req.user?.userId)) as IUser | null;

    if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      res.status(401).json({ message: "Incorrect current password" });
      return;
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  });

  static verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
      res.status(400).json({ message: "Invalid verification token" });
      return;
    }

    const hashedToken = hashToken(verificationToken);

    const userToken = await TokenModel.findOne({
      verificationToken: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!userToken) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
      return;
    }

    const user = await UserModel.findById(userToken.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User is already verified" });
      return;
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "User verified" });
  });

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    await TokenModel.deleteOne({ userId: user._id });

    const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
    const hashedToken = hashToken(verificationToken);

    await TokenModel.create({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification",
        template: "verifyEmail",
        data: { name: user.name, verificationUrl },
      });
      res.status(200).json({ message: "Verification email sent" });
    } catch {
      res.status(500).json({ message: "Email could not be sent" });
    }
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await TokenModel.deleteOne({ userId: user._id });

    const passwordResetToken =
      crypto.randomBytes(64).toString("hex") + user._id;
    const hashedToken = hashToken(passwordResetToken);

    await TokenModel.create({
      userId: user._id,
      passwordResetToken: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

    try {
      await sendEmail({
        subject: "Password Reset",
        email: user.email,
        template: "forgotPassword",
        data: { name: user.name, url: resetLink },
      });
      res.status(200).json({ message: "Email sent" });
    } catch {
      res.status(500).json({ message: "Email could not be sent" });
    }
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { resetPasswordToken } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const hashedToken = hashToken(resetPasswordToken);

    const userToken = await TokenModel.findOne({
      passwordResetToken: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!userToken) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    const user = await UserModel.findById(userToken.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.password_hash = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  });

  static deactivateAccount = asyncHandler(
    async (req: Request, res: Response) => {
      const user = await UserModel.findById(req.user?.userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.is_active = false;
      await user.save();

      res.status(200).json({ message: "Account deactivated successfully" });
    }
  );

  static activateAccount = asyncHandler(async (req: Request, res: Response) => {
    let user;

    switch (req.user?.user_type) {
      case "customer":
        user = (await Customer.findById(req.user.userId)) as IUser | null;
        break;
      case "driver":
        user = (await Driver.findById(req.user.userId)) as IUser | null;
        break;
      case "admin":
        user = (await Admin.findById(req.user.userId)) as IUser | null;
        break;
      default:
        res.status(400).json({ message: "Invalid user type" });
        return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.is_active = true;
    await user.save();

    res.status(200).json({ message: "Account activated successfully" });
  });
}
