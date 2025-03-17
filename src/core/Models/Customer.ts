import { Schema, model, Document } from "mongoose";
import { ICustomer } from "../../core/interfaces/ICustomer";

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

export const Customer = model<ICustomer>("Customer", CustomerSchema);
