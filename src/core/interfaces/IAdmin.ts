import { Document, Types } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  balance: Types.Decimal128;
  profit_percentage: number;
  admin_level: string;
}
