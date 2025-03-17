import mongoose, { Schema, Document } from "mongoose";
import { IAdmin } from "../interfaces/IAdmin";

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  balance: { type: Schema.Types.Decimal128, required: true },
  profit_percentage: { type: Number, required: true },
  admin_level: { type: String, required: true },
});

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
