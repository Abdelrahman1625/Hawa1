import { Schema, model, Types, Document } from "mongoose";

export interface IToken extends Document {
  user_id: Types.ObjectId;
  token: string;
  expires_at: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expires_at: { type: Date, required: true },
  },
  { timestamps: true }
);

export const TokenModel = model<IToken>("Token", tokenSchema);
