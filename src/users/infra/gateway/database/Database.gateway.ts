import { Inject } from '@nestjs/common';

import type { IDataBaseGateway } from './Database.gateway.interface';
import type { IUserDatabaseAdapter } from '../../adapter/database/UserDatabase.adapter.interface';

import { User } from '@users/domain/entity/User';

import { USER_DATABASE_ADAPTER } from '@users/utils/constants';

export class DatabaseGateway implements IDataBaseGateway {
  constructor(
    @Inject(USER_DATABASE_ADAPTER)
    private readonly userDatabaseAdapter: IUserDatabaseAdapter,
  ) {}

  async find(id: string): Promise<User> {
    const foundUser = await this.userDatabaseAdapter.findOne({ id });

    return foundUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.userDatabaseAdapter.findOne({ email });

    return foundUser;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const foundUser = await this.userDatabaseAdapter.findOne({ email });

    return !!foundUser;
  }

  async create(entity: User): Promise<void> {
    this.userDatabaseAdapter.create(entity);
  }

  async update(entity: User): Promise<void> {
    this.userDatabaseAdapter.update(entity);
  }
}
