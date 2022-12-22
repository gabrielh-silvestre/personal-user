import { Injectable } from '@nestjs/common';

import type { IDatabaseAdapter } from '../Database.adapter.interface';
import type { IUser } from '@users/domain/entity/user.interface';

import { User } from '@users/domain/entity/User';

@Injectable()
export class DatabaseMemoryAdapter implements IDatabaseAdapter {
  private static readonly USERS: User[] = [];

  async findAll(): Promise<User[]> {
    return DatabaseMemoryAdapter.USERS;
  }

  async findOne<T extends Partial<IUser>>(dto: T): Promise<User> {
    const foundUser = DatabaseMemoryAdapter.USERS.find((user) =>
      Object.entries(dto).every(([key, value]) => user[key] === value),
    );

    return foundUser;
  }

  async create(user: User): Promise<void> {
    DatabaseMemoryAdapter.USERS.push(user);
  }

  async update(user: User): Promise<void> {
    const foundUserIndex = DatabaseMemoryAdapter.USERS.findIndex(
      ({ id }) => user.id === id,
    );

    DatabaseMemoryAdapter.USERS[foundUserIndex] = user;
  }

  async delete(id: string): Promise<void> {
    const foundUserIndex = DatabaseMemoryAdapter.USERS.findIndex(
      (user) => user.id === id,
    );

    DatabaseMemoryAdapter.USERS.splice(foundUserIndex, 1);
  }

  static reset(users: User[]): void {
    DatabaseMemoryAdapter.USERS.length = 0;
    DatabaseMemoryAdapter.USERS.push(...users);
  }
}
