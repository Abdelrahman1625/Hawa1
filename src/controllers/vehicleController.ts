import { Request, Response } from "express";
import { VehicleModel } from "../core/Models/Vehicle";

export class VehicleController {
  static async getAllVehicles(req: Request, res: Response) {
    const vehicles = await VehicleModel.find();
    res.status(200).json(vehicles);
  }

  static async createVehicle(req: Request, res: Response) {
    const vehicle = new VehicleModel(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  }

  static async getVehicleById(req: Request, res: Response) {
    const vehicle = await VehicleModel.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(vehicle);
  }
}
