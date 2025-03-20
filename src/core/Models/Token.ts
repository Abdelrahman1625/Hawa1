import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  userId: string;
  token: string;
  passwordResetToken?: string;
  verificationToken?: string;
  createdAt: Date;
  expiresAt: Date;
}

const TokenSchema = new Schema<IToken>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  passwordResetToken: { type: String },
  verificationToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export const TokenModel = mongoose.model<IToken>("Token", TokenSchema);
