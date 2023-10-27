import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import type { IUser } from '@users/domain/entity/user.interface';
import type { InputRecoverPasswordDto } from './RecoverPassword.dto';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';

import { RecoverPasswordRequested } from '@users/domain/event/RecoverPasswordRequested.event';
import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { TOKEN_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class RecoverPasswordUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(TOKEN_GATEWAY)
    private readonly authGateway: ITokenGateway,
    private readonly emitter: EventEmitter2,
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
    const token = await this.generateToken(user.id);

    this.emitter.emitAsync(RecoverPasswordRequested.eventName, {
      user,
      token,
    });
  }
}
