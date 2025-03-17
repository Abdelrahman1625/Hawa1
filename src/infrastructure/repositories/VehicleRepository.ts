import { VehicleModel } from "../../core/entities/Vehicle";
import { Repository } from "./GenericRepository";
import { IVehicleRepository } from "../interfacesRepositories/IVehicleRepository";
import { IVehicleDocument } from "../../core/interfaces/IVehicle";

export class VehicleRepository
  extends Repository<IVehicleDocument>
  implements IVehicleRepository
{
  constructor() {
    super(VehicleModel);
  }

  async findByPlate(plate_number: string): Promise<IVehicleDocument | null> {
    return await this.model.findOne({ plate_number }).lean().exec();
  }
}
