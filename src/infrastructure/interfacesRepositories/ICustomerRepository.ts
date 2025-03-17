import { IRepository } from "./IRepository";
import { ICustomer } from "../../core/interfaces/ICustomer";

export interface ICustomerRepository extends IRepository<ICustomer> {
  findByPhone(phone: string): Promise<ICustomer | null>;
}
