import { Injectable } from '@nestjs/common';

import type { IUserDatabaseAdapter } from '../UserDatabase.adapter.interface';
import type { IUser } from '@users/domain/entity/user.interface';

import { User } from '@users/domain/entity/User';

@Injectable()
export class UserDatabaseMemoryAdapter implements IUserDatabaseAdapter {
  private static readonly USERS: User[] = [];

  async findAll(): Promise<User[]> {
    return UserDatabaseMemoryAdapter.USERS;
  }

  async findOne<T extends Partial<IUser>>(dto: T): Promise<User> {
    const foundUser = UserDatabaseMemoryAdapter.USERS.find((user) =>
      Object.entries(dto).every(([key, value]) => user[key] === value),
    );

    return foundUser;
  }

  async create(user: User): Promise<void> {
    UserDatabaseMemoryAdapter.USERS.push(user);
  }

  async update(user: User): Promise<void> {
    const foundUserIndex = UserDatabaseMemoryAdapter.USERS.findIndex(
      ({ id }) => user.id === id,
    );

    UserDatabaseMemoryAdapter.USERS[foundUserIndex] = user;
  }

  async delete(id: string): Promise<void> {
    const foundUserIndex = UserDatabaseMemoryAdapter.USERS.findIndex(
      (user) => user.id === id,
    );

    UserDatabaseMemoryAdapter.USERS.splice(foundUserIndex, 1);
  }

  static reset(users: User[]): void {
    UserDatabaseMemoryAdapter.USERS.length = 0;
    UserDatabaseMemoryAdapter.USERS.push(...users);
  }
}
