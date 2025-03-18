import { Request, Response } from "express";
import { Admin } from "../core/Models/Admin";

export class AdminController {
  static async getAllAdmins(req: Request, res: Response) {
    const admins = await Admin.find();
    res.status(200).json(admins);
  }

  static async createAdmin(req: Request, res: Response) {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  }
}
