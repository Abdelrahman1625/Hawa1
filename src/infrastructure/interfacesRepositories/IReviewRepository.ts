import { IRepository } from "./IRepository";
import { IReview } from "../../core/interfaces/IReview";

export interface IReviewRepository extends IRepository<IReview> {
  findByRideId(ride_id: string): Promise<IReview[]>;
}
