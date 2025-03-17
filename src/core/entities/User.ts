import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

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

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    user_type: {
      type: String,
      required: true,
      enum: ["customer", "driver", "admin"],
    },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    discriminatorKey: "user_type",
    toJSON: { virtuals: true, getters: true },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password_hash")) {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
