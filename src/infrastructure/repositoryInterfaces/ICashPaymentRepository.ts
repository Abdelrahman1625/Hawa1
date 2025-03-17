import { IRepository } from "./IRepository";
import { ICashPayment } from "../../core/interfaces/ICashPayment";

export interface ICashPaymentRepository extends IRepository<ICashPayment> {
  findByUserId(user_id: string): Promise<ICashPayment[]>;
}
