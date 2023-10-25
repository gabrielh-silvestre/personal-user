import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { InputRecoverPasswordDto } from './RecoverPassword.dto';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { TOKEN_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

// IMPORTANT Does not have a real behavior yet, but the rules are been applied
@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(TOKEN_GATEWAY)
    private readonly authGateway: ITokenGateway,
  ) {}

  private async foundUserByEmail(email: string): Promise<IUser | never> {
    const foundUser = await this.databaseGateway.findByEmail(email);

    if (!foundUser) {
      throw ExceptionFactory.notFound('Email not registered');
    }

    return foundUser;
  }

  private async generateToken(userId: string): Promise<string> {
    return this.authGateway.generate(userId);
  }

  async execute({ email }: InputRecoverPasswordDto): Promise<void | never> {
    const user = await this.foundUserByEmail(email);
    await this.generateToken(user.id);
  }
}
