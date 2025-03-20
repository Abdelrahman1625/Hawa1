import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  address: string;
  user_type: string;
  comparePassword(password: string): Promise<boolean>;
}
