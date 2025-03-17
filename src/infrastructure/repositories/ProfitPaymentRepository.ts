import mongoose, { Schema, model, Document } from "mongoose";

const ProfitPaymentSchema = new Schema(
  {
    driver_id: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    admin_id: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProfitPayment = model("ProfitPayment", ProfitPaymentSchema);
