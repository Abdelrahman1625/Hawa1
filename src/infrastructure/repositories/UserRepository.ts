import { UserModel } from "../../core/Models/User";
import { IUser } from "../../core/interfaces/IUser";
import { IUserRepository } from "../repositoryInterfaces/IUserRepository";
import { Repository } from "./GenericRepository";

export class UserRepository
  extends Repository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }
}
