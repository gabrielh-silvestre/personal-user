import type {
  IDatabaseGateway,
  OrmUserDto,
} from './Database.gateway.interface';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

import { PrismaClient } from '@prisma/client';

export class DatabaseGateway implements IDatabaseGateway {
  constructor(private readonly client: PrismaClient = new PrismaClient()) {}

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

  private async findOne<U extends Partial<OrmUserDto>>(
    dto: U,
  ): Promise<OrmUserDto | null> {
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

    return foundUser || null;
  }

  async find(id: string): Promise<User> {
    const foundUser = await this.findOne({ id });

    return foundUser ? UserFactory.transformFromDto(foundUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await this.findOne({ email });

    return foundUser ? UserFactory.transformFromDto(foundUser) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const foundUser = await this.findOne({ email });

    return !!foundUser;
  }

  async create(entity: User): Promise<void> {
    await this.client.user.create({ data: this.convertToOrm(entity) });
  }

  async update(entity: User): Promise<void> {
    const data = { ...this.convertToOrm(entity) };
    delete data.id;

    await this.client.user.update({
      where: { id: entity.id },
      data,
    });
  }
}
