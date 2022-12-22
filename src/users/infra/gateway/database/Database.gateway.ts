import { Inject } from '@nestjs/common';

import type { IDatabaseGateway } from './Database.gateway.interface';
import type { IDatabaseAdapter } from '../../adapter/database/Database.adapter.interface';

import { User } from '@users/domain/entity/User';

import { USER_DATABASE_ADAPTER } from '@users/utils/constants';

export class DatabaseGateway implements IDatabaseGateway {
  constructor(
    @Inject(USER_DATABASE_ADAPTER)
    private readonly databaseAdapter: IDatabaseAdapter,
  ) {}

  async find(id: string): Promise<User> {
    const foundUser = await this.databaseAdapter.findOne({ id });

    return foundUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.databaseAdapter.findOne({ email });

    return foundUser;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const foundUser = await this.databaseAdapter.findOne({ email });

    return !!foundUser;
  }

  async create(entity: User): Promise<void> {
    this.databaseAdapter.create(entity);
  }

  async update(entity: User): Promise<void> {
    this.databaseAdapter.update(entity);
  }
}
