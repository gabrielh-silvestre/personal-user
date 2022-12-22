import { Inject, Injectable } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { InputCreateUserDto, OutputCreateUserDto } from './CreateUser.dto';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import { UserFactory } from '@users/domain/factory/User.factory';
import { ExceptionFactory } from '@exceptions/factory/Exception.factory';

import { MAIL_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly databaseGateway: IDatabaseGateway,
    @Inject(MAIL_GATEWAY) private readonly mailGateway: IMailGateway,
  ) {}

  private async isEmailAlreadyInUse(email: string): Promise<void | never> {
    const isInUse = await this.databaseGateway.existsByEmail(email);

    if (isInUse) {
      throw ExceptionFactory.conflict('Email already registered');
    }
  }

  private isCredentialsEqual(
    email: string,
    confirmEmail: string,
    password: string,
    confirmPassword: string,
  ): void | never {
    const isEmailEqual = email === confirmEmail;
    const isPasswordEqual = password === confirmPassword;

    if (!isEmailEqual || !isPasswordEqual) {
      throw ExceptionFactory.invalidArgument('Credentials not match');
    }
  }

  private async createUserEmail(user: IUser): Promise<void | never> {
    this.mailGateway.welcomeMail(user);
  }

  async execute({
    email,
    confirmEmail,
    username,
    password,
    confirmPassword,
  }: InputCreateUserDto): Promise<OutputCreateUserDto | never> {
    this.isCredentialsEqual(email, confirmEmail, password, confirmPassword);
    await this.isEmailAlreadyInUse(email);

    const newUser = UserFactory.create(username, email, password);

    await this.databaseGateway.create(newUser);
    this.createUserEmail(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      lastUpdate: newUser.updatedAt,
      created: newUser.createdAt,
    };
  }
}
