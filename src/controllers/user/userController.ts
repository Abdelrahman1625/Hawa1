import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../core/Models/User";
import { RequestHandler } from "express";

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "The Email is already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.create({
        name,
        email,
        password_hash: hashedPassword,
      });

      const userResponse = { ...newUser.toObject(), password_hash: undefined };
      res.status(201).json({ message: "Register Success", user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email or Password invalid" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Email or Password invalid" });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      res.json({ message: "Login Successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }

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

  // Update user
  public updateUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { name, email, phone, address } = req.body;
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update fields if provided
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
