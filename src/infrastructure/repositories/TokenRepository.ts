import { TokenModel, IToken } from "../../core/entities/Token";

export class TokenRepository {
  async createToken(tokenData: Partial<IToken>): Promise<IToken> {
    const token = new TokenModel(tokenData);
    return await token.save();
  }

  async findTokenByValue(token: string): Promise<IToken | null> {
    return await TokenModel.findOne({ token }).exec();
  }

  async deleteToken(tokenId: string): Promise<IToken | null> {
    return await TokenModel.findByIdAndDelete(tokenId).exec();
  }
}
