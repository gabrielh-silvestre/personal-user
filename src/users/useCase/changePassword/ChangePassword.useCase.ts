import { Inject, Injectable } from '@nestjs/common';

import type { InputChangePasswordDto } from './ChangePassword.dto';
import type { IUserRepository } from '@users/domain/repository/user.repository.interface';

import { User } from '@users/domain/entity/User';
import { PasswordFactory } from '@users/domain/factory/Password.factory';

import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { USER_REPOSITORY } from '@users/utils/constants';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  private passwordMatch(
    newPassword: string,
    confirmPassword: string,
  ): void | never {
    if (newPassword !== confirmPassword) {
      throw ExceptionFactory.invalidArgument('Passwords do not match');
    }
  }

  private async findUser(id: string): Promise<User | never> {
    const foundUser = await this.userRepository.find(id);

    if (!foundUser) {
      throw ExceptionFactory.notFound('User not found');
    }

    return foundUser;
  }

  async execute({
    id,
    newPassword,
    confirmPassword,
  }: InputChangePasswordDto): Promise<void | never> {
    this.passwordMatch(newPassword, confirmPassword);

    const user = await this.findUser(id);

    user.changePassword(PasswordFactory.createNew(newPassword));

    await this.userRepository.update(user);
  }
}
