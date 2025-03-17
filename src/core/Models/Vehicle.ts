import { Schema, model } from "mongoose";
import { IVehicleDocument } from "../interfaces/IVehicle";

const VehicleSchema = new Schema<IVehicleDocument>({
  owner_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  type: { type: String, required: true, enum: ["car", "bike", "truck"] },
  brand: { type: String, required: true },
  vehicle_model: { type: String, required: true },
  plate_number: { type: String, required: true, unique: true },
  color: { type: String, required: true },
});

export const VehicleModel = model<IVehicleDocument>("Vehicle", VehicleSchema);
