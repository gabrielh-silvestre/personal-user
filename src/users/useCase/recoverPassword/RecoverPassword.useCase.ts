import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { InputRecoverPasswordDto } from './RecoverPassword.dto';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { AUTH_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(AUTH_GATEWAY) private readonly authGateway: IAuthGateway,
  ) {}

  private async foundUserByEmail(email: string): Promise<IUser | never> {
    const foundUser = await this.databaseGateway.findByEmail(email);

    if (!foundUser) {
      throw ExceptionFactory.notFound('Email not registered');
    }

    return foundUser;
  }

  private async generateToken(userId: string): Promise<string> {
    return this.authGateway.generateRecoverPasswordToken(userId);
  }

  async execute({ email }: InputRecoverPasswordDto): Promise<void | never> {
    const user = await this.foundUserByEmail(email);

    console.log(`Recovering ${user.username} password...`);
  }
}
