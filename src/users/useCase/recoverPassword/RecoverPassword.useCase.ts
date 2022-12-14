import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { InputRecoverPasswordDto } from './RecoverPassword.dto';
import type { IUserRepository } from '@users/domain/repository/user.repository.interface';
import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import {
  AUTH_GATEWAY,
  MAIL_GATEWAY,
  USER_REPOSITORY,
} from '@users/utils/constants';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(AUTH_GATEWAY) private readonly authGateway: IAuthGateway,
    @Inject(MAIL_GATEWAY) private readonly mailGateway: IMailGateway,
  ) {}

  private async foundUserByEmail(email: string): Promise<IUser | never> {
    const foundUser = await this.userRepository.findByEmail(email);

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
    const recoverPassToken = await this.generateToken(user.id);

    await this.mailGateway.recoverPasswordMail({
      email: user.email,
      username: user.username,
      token: recoverPassToken,
    });
  }
}
