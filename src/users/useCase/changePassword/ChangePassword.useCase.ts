import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { InputChangePasswordDto } from './ChangePassword.dto';
import type { IEventDispatcher } from '@shared/domain/event/event.dispatcher.interface';

import { User } from '@users/domain/entity/User';
import { PasswordFactory } from '@users/domain/factory/Password.factory';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { DATABASE_GATEWAY, EVENT_DISPATCHER } from '@users/utils/constants';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher<IUser>,
  ) {}

  private passwordMatch(
    newPassword: string,
    confirmPassword: string,
  ): void | never {
    if (newPassword !== confirmPassword) {
      throw ExceptionFactory.invalidArgument('Passwords do not match');
    }
  }

  private async findUser(id: string): Promise<User | never> {
    const foundUser = await this.databaseGateway.find(id);

    if (!foundUser) {
      throw ExceptionFactory.notFound('User not found');
    }

    return foundUser;
  }

  async execute({
    id,
    newPassword,
    confirmPassword,
  }: InputChangePasswordDto): Promise<void | never> {
    this.passwordMatch(newPassword, confirmPassword);

    const user = await this.findUser(id);

    user.changePassword(
      PasswordFactory.createNew(newPassword),
      this.eventDispatcher,
    );

    await this.databaseGateway.update(user);
  }
}
