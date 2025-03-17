import { Repository } from "./GenericRepository";
import { Customer } from "../../core/entities/Customer";
import { ICustomer } from "../../core/interfaces/ICustomer";
import { ICustomerRepository } from "../interfacesRepositories/ICustomerRepository";

export class CustomerRepository
  extends Repository<ICustomer>
  implements ICustomerRepository
{
  constructor() {
    super(Customer);
  }

  async findByPhone(phone: string): Promise<ICustomer | null> {
    return await this.model.findOne({ phone }).exec();
  }
}
