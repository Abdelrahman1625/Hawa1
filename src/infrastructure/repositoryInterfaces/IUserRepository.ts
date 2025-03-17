import { IRepository } from "./IRepository";
import { IUser } from "../../core/interfaces/IUser";

export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
