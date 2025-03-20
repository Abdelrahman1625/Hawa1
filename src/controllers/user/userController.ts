import { UserModel } from "../../core/Models/User";
import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

export class UserController {
  // Get all users
  public static getAllUsers: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const users = await UserModel.find().select("-password_hash");
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  };

  // Get user by ID
  public static getUserById: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const user = await UserModel.findById(req.params.id).select(
        "-password_hash"
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  };

  // Register user
  public static register: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { name, email, password, phone, address } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        name,
        email,
        password_hash: hashedPassword,
        phone,
        address,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  };

  // User login
  public static login: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Missing email or password" });
        return;
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  };

  // Update user
  public static updateUser: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const { name, email, phone, address } = req.body;
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      await user.save();
      const { password_hash, ...userResponse } = user.toObject();
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  };

  // Delete user
  public static deleteUser: RequestHandler = async (
    req,
    res
  ): Promise<void> => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  };
}
