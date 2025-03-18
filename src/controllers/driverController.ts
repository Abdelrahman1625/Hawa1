import { Request, Response } from "express";
import { Driver } from "../core/Models/Driver";

export class DriverController {
  static async getAllDrivers(req: Request, res: Response) {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  }

  static async createDriver(req: Request, res: Response) {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  }

  static async getDriverById(req: Request, res: Response) {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  }
}
