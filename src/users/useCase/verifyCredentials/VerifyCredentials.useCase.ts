import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { IDataBaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type {
  InputVerifyCredentialsDto,
  OutputVerifyCredentialsDto,
} from './VerifyCredentials.dto';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class VerifyCredentialsUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDataBaseGateway,
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
  }: InputVerifyCredentialsDto): Promise<OutputVerifyCredentialsDto | never> {
    const foundUser = await this.foundUserByEmail(email);

    const isPasswordValid = foundUser.password.isEqual(password);

    if (!isPasswordValid) {
      throw ExceptionFactory.unauthorized('Invalid credentials');
    }

    return { id: foundUser.id };
  }
}
