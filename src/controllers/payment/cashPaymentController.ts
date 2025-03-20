import { Request, Response } from "express";
import { CashPayment } from "../../core/Models/CashPayment";

export class CashPaymentController {
  static async getAllPayments(req: Request, res: Response) {
    const payments = await CashPayment.find();
    res.status(200).json(payments);
  }

  static async createPayment(req: Request, res: Response) {
    const payment = new CashPayment(req.body);
    await payment.save();
    res.status(201).json(payment);
  }
}
