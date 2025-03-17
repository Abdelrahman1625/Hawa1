import { IRepository } from "./IRepository";
import { IVehicleDocument } from "../../core/interfaces/IVehicle";

export interface IVehicleRepository extends IRepository<IVehicleDocument> {
  findByPlate(plate_number: string): Promise<IVehicleDocument | null>;
}
