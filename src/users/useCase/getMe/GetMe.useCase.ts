import { Inject, Injectable } from '@nestjs/common';

import type { OutputGetMeDto } from './GetMe.dto';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { ExceptionFactory } from '@exceptions/factory/Exception.factory';

import { DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
  ) {}

  async execute(id: string): Promise<OutputGetMeDto | never> {
    const foundUser = await this.databaseGateway.find(id);

    if (!foundUser) {
      throw ExceptionFactory.notFound('User not found');
    }

    return {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      lastUpdate: foundUser.updatedAt,
      createdAt: foundUser.createdAt,
    };
  }
}
