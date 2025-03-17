import { Schema, model, Types, Document } from "mongoose";
import { IReview } from "../../core/interfaces/IReview";

const reviewSchema = new Schema<IReview>(
  {
    ride_id: { type: Schema.Types.ObjectId, required: true, ref: "Ride" },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Review = model<IReview>("Review", reviewSchema);
