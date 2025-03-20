import mongoose from "mongoose";
import { UserModel } from "./User";

const driverSchema = new mongoose.Schema({
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
});

export const Driver = UserModel.discriminator("Driver", driverSchema);
