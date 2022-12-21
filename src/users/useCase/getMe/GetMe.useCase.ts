import { Inject, Injectable } from '@nestjs/common';

import type { OutputGetMeDto } from './GetMe.dto';
import type { IUserRepository } from '@users/domain/repository/user.repository.interface';

import { ExceptionFactory } from '@exceptions/factory/Exception.factory';

import { USER_REPOSITORY } from '@users/utils/constants';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<OutputGetMeDto | never> {
    const foundUser = await this.userRepository.find(id);

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
