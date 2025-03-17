import { IRepository } from "./IRepository";
import { IRide } from "../../core/interfaces/IRide";

export interface IRideRepository extends IRepository<IRide> {
  findByDriverId(driver_id: string): Promise<IRide[]>;
  findByCustomerId(customer_id: string): Promise<IRide[]>;
}
