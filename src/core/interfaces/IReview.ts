import { Document, Types } from "mongoose";

export interface IReview extends Document {
  ride_id: Types.ObjectId;
  user_id: Types.ObjectId;
  rating: number;
  comment?: string;
}
