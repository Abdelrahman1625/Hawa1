import { Schema, model } from "mongoose";
import { IRide } from "../../core/interfaces/IRide";

const RideSchema = new Schema<IRide>(
  {
    driver_id: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "canceled"],
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    fare: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Ride = model<IRide>("Ride", RideSchema);
