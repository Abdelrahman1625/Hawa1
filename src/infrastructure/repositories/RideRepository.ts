import { Repository } from "./GenericRepository";
import { Ride } from "../../core/Models/Ride";
import { IRide } from "../../core/interfaces/IRide";
import { IRideRepository } from "../repositoryInterfaces/IRideRepository";

export class RideRepository
  extends Repository<IRide>
  implements IRideRepository
{
  constructor() {
    super(Ride);
  }

  async findByDriverId(driver_id: string): Promise<IRide[]> {
    return await this.model.find({ driver_id }).exec();
  }

  async findByCustomerId(customer_id: string): Promise<IRide[]> {
    return await this.model.find({ customer_id }).exec();
  }
}
