import { Document, Types } from "mongoose";

export interface ICashPayment extends Document {
  user_id: Types.ObjectId;
  driver_id: Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}
