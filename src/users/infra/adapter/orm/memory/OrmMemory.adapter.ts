import { Injectable } from '@nestjs/common';

import type { IOrmAdapter, OrmUserDto } from '../Orm.adapter.interface';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

@Injectable()
export class OrmMemoryAdapter implements IOrmAdapter {
  private static readonly USERS: User[] = [];

  private static convertToOrm(user: User): OrmUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private static convertToDomain(ormUser: OrmUserDto): User {
    return UserFactory.createFromPersistence(
      ormUser.id,
      ormUser.username,
      ormUser.email,
      ormUser.createdAt,
      ormUser.updatedAt,
      ormUser.password,
    );
  }

  async findAll(): Promise<OrmUserDto[]> {
    return OrmMemoryAdapter.USERS.map(OrmMemoryAdapter.convertToOrm);
  }

  async findOne<T extends Partial<OrmUserDto>>(dto: T): Promise<OrmUserDto> {
    const foundUser = OrmMemoryAdapter.USERS.find((user) =>
      Object.entries(dto).every(([key, value]) => user[key] === value),
    );

    return foundUser ? OrmMemoryAdapter.convertToOrm(foundUser) : null;
  }

  async create(user: OrmUserDto): Promise<void> {
    OrmMemoryAdapter.USERS.push(OrmMemoryAdapter.convertToDomain(user));
  }

  async update(user: OrmUserDto): Promise<void> {
    const foundUserIndex = OrmMemoryAdapter.USERS.findIndex(
      ({ id }) => user.id === id,
    );

    OrmMemoryAdapter.USERS[foundUserIndex] =
      OrmMemoryAdapter.convertToDomain(user);
  }

  async delete(id: string): Promise<void> {
    const foundUserIndex = OrmMemoryAdapter.USERS.findIndex(
      (user) => user.id === id,
    );

    OrmMemoryAdapter.USERS.splice(foundUserIndex, 1);
  }

  static reset(users: User[]): void {
    OrmMemoryAdapter.USERS.length = 0;
    OrmMemoryAdapter.USERS.push(...users);
  }
}
