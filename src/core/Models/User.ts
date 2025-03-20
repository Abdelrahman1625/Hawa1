import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  address: string;
  user_type: string;
  isVerified: boolean; // Ensure this is not optional
  is_active: boolean; // Ensure this is not optional
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  user_type: { type: String, required: true },
  is_active: { type: Boolean, default: true }, // Add this field
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password_hash);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
