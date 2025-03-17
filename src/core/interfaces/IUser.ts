import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  address: string;
  user_type: "customer" | "driver" | "admin";
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
