import { IRepository } from "./IRepository";
import { IAdmin } from "../../core/interfaces/IAdmin";

export interface IAdminRepository extends IRepository<IAdmin> {
  findByLevel(admin_level: string): Promise<IAdmin[]>;
}
