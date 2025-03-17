import { Document, Types } from "mongoose";

export interface IVehicle {
  owner_id: Types.ObjectId;
  type: "car" | "bike" | "truck";
  brand: string;
  vehicle_model: string;
  plate_number: string;
  color: string;
}

export interface IVehicleDocument extends IVehicle, Document {
  owner_id: Types.ObjectId;
  type: "car" | "bike" | "truck";
  brand: string;
  vehicle_model: string;
  plate_number: string;
  color: string;
}
