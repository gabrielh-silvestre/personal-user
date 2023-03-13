import { Module } from '@nestjs/common';

import { RmqModule } from '@shared/modules/rmq/rmq.module';

import { DatabaseGateway } from './infra/gateway/database/Database.gateway';

import { CreateUserController } from './infra/api/controller/create/CreateUser.controller';
import { CreateUserUseCase } from './useCase/create/CreateUser.useCase';

import { VerifyCredentialsController } from './infra/api/controller/verifyCredentials/VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from './useCase/verifyCredentials/VerifyCredentials.useCase';

import { GetMeController } from './infra/api/controller/getMe/GetMe.controller';
import { GetMeUseCase } from './useCase/getMe/GetMe.useCase';

import { ChangePasswordController } from './infra/api/controller/changePassword/ChangePassword.controller';
import { ChangePasswordUseCase } from './useCase/changePassword/ChangePassword.useCase';

import { AuthGateway } from './infra/gateway/auth/Auth.gateway';

import { OrmPrismaAdapter } from './infra/adapter/orm/prisma/OrmPrisma.adapter';
import { QueueRmqAdapter } from './infra/adapter/queue/rmq/QueueRmq.adapter';

import { EventRmqDispatcher } from './infra/event/dispatcher/EventRmq.dispatcher';

import {
  AUTH_GATEWAY,
  AUTH_QUEUE,
  DATABASE_GATEWAY,
  QUEUE_ADAPTER,
  ORM_ADAPTER,
  EVENT_DISPATCHER,
  USER_QUEUE,
} from './utils/constants';

@Module({
  imports: [RmqModule.register(USER_QUEUE), RmqModule.register(AUTH_QUEUE)],
  exports: [GetMeUseCase],
  controllers: [
    CreateUserController,
    GetMeController,
    VerifyCredentialsController,
    ChangePasswordController,
  ],
  providers: [
    CreateUserUseCase,
    GetMeUseCase,
    VerifyCredentialsUseCase,
    ChangePasswordUseCase,
    {
      provide: AUTH_GATEWAY,
      useClass: AuthGateway,
    },
    {
      provide: DATABASE_GATEWAY,
      useClass: DatabaseGateway,
    },
    {
      provide: QUEUE_ADAPTER,
      useClass: QueueRmqAdapter,
    },
    {
      provide: ORM_ADAPTER,
      useClass: OrmPrismaAdapter,
    },
    {
      provide: EVENT_DISPATCHER,
      useClass: EventRmqDispatcher,
    },
  ],
})
export class UserModule {}
