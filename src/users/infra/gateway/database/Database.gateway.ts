import { Inject } from '@nestjs/common';

import type { IDatabaseGateway } from './Database.gateway.interface';
import type {
  IOrmAdapter,
  OrmUserDto,
} from '@users/infra/adapter/orm/Orm.adapter.interface';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

import { ORM_ADAPTER } from '@users/utils/constants';

export class DatabaseGateway implements IDatabaseGateway {
  constructor(
    @Inject(ORM_ADAPTER)
    private readonly ormAdapter: IOrmAdapter,
  ) {}

  private convertFromOrm(foundUser: OrmUserDto): User {
    return UserFactory.createFromPersistence(
      foundUser.id,
      foundUser.username,
      foundUser.email,
      foundUser.createdAt,
      foundUser.updatedAt,
      foundUser.password,
    );
  }

  private convertToOrm(user: User): OrmUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async find(id: string): Promise<User> {
    const foundUser = await this.ormAdapter.findOne({ id });

    return foundUser ? this.convertFromOrm(foundUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.ormAdapter.findOne({ email });

    return foundUser ? this.convertFromOrm(foundUser) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const foundUser = await this.ormAdapter.findOne({ email });

    return !!foundUser;
  }

  async create(entity: User): Promise<void> {
    this.ormAdapter.create(this.convertToOrm(entity));
  }

  async update(entity: User): Promise<void> {
    this.ormAdapter.update(this.convertToOrm(entity));
  }
}
