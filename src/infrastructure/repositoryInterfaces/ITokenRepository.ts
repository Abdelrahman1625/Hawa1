import { IRepository } from "./IRepository";
import { IToken } from "../../core/interfaces/IToken";

export interface ITokenRepository extends IRepository<IToken> {
  findByUserId(user_id: string): Promise<IToken | null>;
}
