import mongoose, { Schema, model } from "mongoose";
import { ICashPayment } from "../../core/interfaces/ICashPayment";

const CashPaymentSchema = new Schema<ICashPayment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver_id: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

export const CashPayment = model<ICashPayment>(
  "CashPayment",
  CashPaymentSchema
);
