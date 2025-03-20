import { Request, Response } from "express";
import { Review } from "../../core/Models/Review";

export class ReviewController {
  static async getAllReviews(req: Request, res: Response) {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  }

  static async createReview(req: Request, res: Response) {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  }
}
