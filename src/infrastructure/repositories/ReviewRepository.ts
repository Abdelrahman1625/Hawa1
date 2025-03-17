import { Review } from "../../core/entities/Review";
import { IReview } from "../../core/interfaces/IReview";

export class ReviewRepository {
  async createReview(reviewData: Omit<IReview, "_id">): Promise<IReview> {
    const review = new Review(reviewData);
    return await review.save();
  }

  async findReviewById(reviewId: string): Promise<IReview | null> {
    return await Review.findById(reviewId);
  }
}
