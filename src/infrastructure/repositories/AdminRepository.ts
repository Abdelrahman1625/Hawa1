import { Repository } from "./GenericRepository";
import { Admin } from "../../core/Models/Admin";
import { IAdmin } from "../../core/interfaces/IAdmin";
import { IAdminRepository } from "../repositoryInterfaces/IAdminRepository";
import { Model } from "mongoose";

export class AdminRepository
  extends Repository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin as Model<IAdmin>);
  }

  async findByLevel(admin_level: string): Promise<IAdmin[]> {
    return await this.model.find({ admin_level }).exec();
  }
}
