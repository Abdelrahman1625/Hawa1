import mongoose from "mongoose";
import { User } from "./User";

const driverSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    balance: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "pending", "banned"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Driver = User.discriminator("Driver", driverSchema);
