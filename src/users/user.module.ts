import { Module } from '@nestjs/common';

import { RmqModule } from '@shared/modules/rmq/rmq.module';
import { AwsModule } from '@shared/modules/aws/Aws.module';

import { DatabaseGateway } from './infra/gateway/database/Database.gateway';

import { CreateUserController } from './infra/api/controller/create/CreateUser.controller';
import { CreateUserUseCase } from './useCase/create/CreateUser.useCase';

import { VerifyCredentialsController } from './infra/api/controller/verifyCredentials/VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from './useCase/verifyCredentials/VerifyCredentials.useCase';

import { GetMeController } from './infra/api/controller/getMe/GetMe.controller';
import { GetMeUseCase } from './useCase/getMe/GetMe.useCase';

import { RecoverPasswordController } from './infra/api/controller/recoverPassword/RecoverPassword.controller';
import { RecoverPasswordUseCase } from './useCase/recoverPassword/RecoverPassword.useCase';

import { ChangePasswordController } from './infra/api/controller/changePassword/ChangePassword.controller';
import { ChangePasswordUseCase } from './useCase/changePassword/ChangePassword.useCase';

import { ChangeAvatarController } from './infra/api/controller/changeAvatar/ChangeAvatar.controller';
import { ChangeAvatarUseCase } from './useCase/changeAvatar/ChangeAvatar.useCase';

import { BucketGateway } from './infra/gateway/bucket/Bucket.gateway';

import { QueueRmqAdapter } from './infra/adapter/queue/rmq/QueueRmq.adapter';

import {
  AUTH_GATEWAY,
  AUTH_QUEUE,
  BUCKET_GATEWAY,
  DATABASE_GATEWAY,
  QUEUE_ADAPTER,
} from './utils/constants';

@Module({
  imports: [RmqModule.register(AUTH_QUEUE), AwsModule],
  exports: [GetMeUseCase],
  controllers: [
    CreateUserController,
    GetMeController,
    VerifyCredentialsController,
    RecoverPasswordController,
    ChangePasswordController,
    ChangeAvatarController,
  ],
  providers: [
    CreateUserUseCase,
    GetMeUseCase,
    VerifyCredentialsUseCase,
    RecoverPasswordUseCase,
    ChangePasswordUseCase,
    ChangeAvatarUseCase,
    {
      provide: AUTH_GATEWAY,
      useValue: {
        verify: async () => ({
          // TODO: change this mock, refactor this gateway
          userId: 'f4aa8420-ee76-4ab7-a353-4cdea1c94120',
        }),
      },
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
      provide: BUCKET_GATEWAY,
      useClass: BucketGateway,
    },
  ],
})
export class UserModule {}
