import mongoose from "mongoose";
import { IProfitPayment } from "../../core/interfaces/IProfitPayment";

const profitPaymentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ProfitPayment = mongoose.model(
  "ProfitPayment",
  profitPaymentSchema
);
