import { Repository } from "./GenericRepository";
import { CashPayment } from "../../core/Models/CashPayment";
import { ICashPayment } from "../../core/interfaces/ICashPayment";
import { ICashPaymentRepository } from "../repositoryInterfaces/ICashPaymentRepository";

export class CashPaymentRepository
  extends Repository<ICashPayment>
  implements ICashPaymentRepository
{
  constructor() {
    super(CashPayment);
  }

  async findByUserId(user_id: string): Promise<ICashPayment[]> {
    return await this.model.find({ user_id }).exec();
  }
}
