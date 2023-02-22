import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type { IOrmAdapter, OrmUserDto } from '../Orm.adapter.interface';

@Injectable()
export class OrmPrismaAdapter implements IOrmAdapter {
  private readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async findAll(): Promise<OrmUserDto[]> {
    return this.client.user.findMany();
  }

  async findOne<U extends Partial<OrmUserDto>>(
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

  async create(data: OrmUserDto): Promise<void> {
    await this.client.user.create({ data });
  }

  async update(data: OrmUserDto): Promise<void> {
    await this.client.user.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.user.delete({ where: { id } });
  }
}
