import { IRepository } from "./IRepository";
import { IDriver } from "../../core/interfaces/IDriver";

export interface IDriverRepository extends IRepository<IDriver> {
  findByLicense(license_number: string): Promise<IDriver | null>;
}
