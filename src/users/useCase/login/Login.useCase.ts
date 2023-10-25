import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';

import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import type { InputLoginDto, OutputLoginDto } from './Login.dto';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { TOKEN_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(TOKEN_GATEWAY)
    private readonly authGateway: ITokenGateway,
  ) {}

  private async foundUserByEmail(email: string): Promise<IUser | never> {
    const foundUser = await this.databaseGateway.findByEmail(email);

    if (!foundUser) {
      throw ExceptionFactory.notFound('User not found');
    }

    return foundUser;
  }

  async execute({
    email,
    password,
  }: InputLoginDto): Promise<OutputLoginDto | never> {
    const foundUser = await this.foundUserByEmail(email);

    const isPasswordValid = foundUser.password.isEqual(password);
    if (!isPasswordValid) {
      throw ExceptionFactory.unauthorized('Invalid credentials');
    }

    const token = await this.authGateway.generate(foundUser.id);

    return {
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
      },
    };
  }
}
