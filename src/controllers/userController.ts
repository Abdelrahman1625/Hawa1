import { Request, Response } from "express";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../core/Models/User";

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

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find().select("-password_hash");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id).select(
        "-password_hash"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body;

      // If password is provided, hash it
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 10);
      }

      const updatedUser = await this.userRepository.update(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userResponse = {
        ...updatedUser.toObject(),
        password_hash: undefined,
      };
      res.json({ message: "Update Success", user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }
}
