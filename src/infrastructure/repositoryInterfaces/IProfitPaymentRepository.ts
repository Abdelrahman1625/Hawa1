import { Document, ObjectId } from "mongoose";

export interface IProfitPayment extends Document {
  amount: number;
  adminId: ObjectId;
  driver_id: ObjectId;
  status: "pending" | "completed" | "failed";
  date: Date;
}
