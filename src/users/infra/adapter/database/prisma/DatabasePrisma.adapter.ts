import { Injectable } from '@nestjs/common';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

import type { IUser } from '@users/domain/entity/user.interface';
import type { IDatabaseAdapter } from '../Database.adapter.interface';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

@Injectable()
export class DatabasePrismaAdapter implements IDatabaseAdapter {
  private readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  private convertToUser(foundUser: PrismaUser): User {
    return UserFactory.createFromPersistence(
      foundUser.id,
      foundUser.username,
      foundUser.email,
      foundUser.createdAt,
      foundUser.updatedAt,
      foundUser.password,
    );
  }

  async findAll(): Promise<User[]> {
    const foundUsers = await this.client.user.findMany();
    return foundUsers.map(this.convertToUser);
  }

  async findOne<T extends Partial<IUser>>(dto: T): Promise<User> {
    const normalizedDto = Object.entries(dto).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {},
    );

    const foundUser = await this.client.user.findFirst({
      where: normalizedDto,
    });

    return this.convertToUser(foundUser);
  }

  async create(user: User): Promise<void> {
    await this.client.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async update(user: User): Promise<void> {
    await this.client.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        password: user.password.toString(),
        updatedAt: user.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.user.delete({
      where: { id },
    });
  }
}
