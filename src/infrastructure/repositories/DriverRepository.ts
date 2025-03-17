import { Repository } from "./GenericRepository";
import { Driver } from "../../core/entities/Driver";
import { IDriverRepository } from "../interfacesRepositories/IDriverRepository";
import { IDriver } from "../../core/interfaces/IDriver";

export class DriverRepository
  extends Repository<IDriver>
  implements IDriverRepository
{
  constructor() {
    super(Driver);
  }

  async findByLicense(license_number: string): Promise<IDriver | null> {
    return await this.model.findOne({ license_number }).exec();
  }
}
