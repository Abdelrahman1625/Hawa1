import { Request, Response } from "express";
import { Ride } from "../core/Models/Ride";

export class RideController {
  static async getAllRides(req: Request, res: Response) {
    const rides = await Ride.find();
    res.status(200).json(rides);
  }

  static async createRide(req: Request, res: Response) {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  }
}
