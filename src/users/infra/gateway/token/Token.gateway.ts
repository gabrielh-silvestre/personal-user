import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { ITokenGateway, TokenPayload } from './token.gateway.interface';

@Injectable()
export class TokenGateway implements ITokenGateway {
  constructor(private readonly jwt: JwtService) {}

  async validate(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token);
  }

  async generate(userId: string): Promise<string> {
    return this.jwt.signAsync({ userId });
  }
}
