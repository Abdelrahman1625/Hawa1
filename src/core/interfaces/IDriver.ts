import { IUser } from "./IUser";

export interface IDriver extends IUser {
  license_number: string;
  vehicle_id: string;
  rating: number;
}
