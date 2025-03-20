import { Request, Response } from "express";
import { ProfitPayment } from "../../core/Models/ProfitPayment";

export class ProfitPaymentController {
  static async getAllPayments(req: Request, res: Response) {
    const payments = await ProfitPayment.find();
    res.status(200).json(payments);
  }

  static async createPayment(req: Request, res: Response) {
    const payment = new ProfitPayment(req.body);
    await payment.save();
    res.status(201).json(payment);
  }
}
