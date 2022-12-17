import { Module } from '@nestjs/common/decorators';
// import { ConfigModule } from '@nestjs/config';

// import { AuthModule } from '@auth/auth.module';
import { RmqModule } from '@shared/modules/rmq/rmq.module';

import { UserDatabasePrismaAdapter } from './infra/adapter/database/prisma/UserPrisma.adapter';
import { UserRepository } from './infra/repository/User.repository';

import { CreateUserController } from './infra/api/controller/create/CreateUser.controller';
import { CreateUserUseCase } from './useCase/create/CreateUser.useCase';

import { VerifyCredentialsController } from './infra/api/controller/verifyCredentials/VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from './useCase/verifyCredentials/VerifyCredentials.useCase';

import { GetMeController } from './infra/api/controller/getMe/GetMe.controller';
import { GetUserByIdUseCase } from './useCase/getById/GetUserById.useCase';

import { GetUserByEmailUseCase } from './useCase/getByEmail/GetUserByEmail.useCase';

import { AuthRmqAdapter } from './infra/adapter/auth/rmq/AuthRmq.adapter';
import { AuthGateway } from './infra/gateway/auth/Auth.gateway';

import { MailRmqAdapter } from './infra/adapter/mail/rmq/MailRmq.adapter';
import { MailGateway } from './infra/gateway/mail/Mail.gateway';

import {
  AUTH_ADAPTER,
  AUTH_GATEWAY,
  AUTH_QUEUE,
  MAIL_ADAPTER,
  MAIL_GATEWAY,
  MAIL_QUEUE,
  USER_DATABASE_ADAPTER,
  USER_REPOSITORY,
} from './utils/constants';

@Module({
  imports: [RmqModule.register(MAIL_QUEUE), RmqModule.register(AUTH_QUEUE)],
  exports: [GetUserByIdUseCase, GetUserByEmailUseCase],
  controllers: [
    CreateUserController,
    GetMeController,
    VerifyCredentialsController,
  ],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    VerifyCredentialsUseCase,
    {
      provide: MAIL_GATEWAY,
      useClass: MailGateway,
    },
    {
      provide: MAIL_ADAPTER,
      useClass: MailRmqAdapter,
    },
    {
      provide: AUTH_ADAPTER,
      useClass: AuthRmqAdapter,
    },
    {
      provide: AUTH_GATEWAY,
      useClass: AuthGateway,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_DATABASE_ADAPTER,
      useClass: UserDatabasePrismaAdapter,
    },
  ],
})
export class UserModule {}
