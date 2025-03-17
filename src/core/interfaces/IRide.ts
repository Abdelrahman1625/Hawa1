import { Document, ObjectId } from "mongoose";

export interface IRide extends Document {
  driver_id: ObjectId;
  customer_id: ObjectId;
  status: "pending" | "accepted" | "completed" | "canceled";
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
  createdAt: Date;
}
