import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@shared/modules/prisma/Prisma.module';
import { AwsModule } from '@shared/modules/aws/Aws.module';
import { RmqModule } from '@shared/modules/rmq/rmq.module';

import { DatabaseGateway } from './infra/gateway/database/Database.gateway';

import { CreateUserController } from './infra/api/controller/create/CreateUser.controller';
import { CreateUserUseCase } from './useCase/create/CreateUser.useCase';

import { LoginController } from './infra/api/controller/login/Login.controller';
import { LoginUseCase } from './useCase/login/Login.useCase';

import { GetMeController } from './infra/api/controller/getMe/GetMe.controller';
import { GetMeUseCase } from './useCase/getMe/GetMe.useCase';

import { RecoverPasswordController } from './infra/api/controller/recoverPassword/RecoverPassword.controller';
import { RecoverPasswordUseCase } from './useCase/recoverPassword/RecoverPassword.useCase';

import { ChangePasswordController } from './infra/api/controller/changePassword/ChangePassword.controller';
import { ChangePasswordUseCase } from './useCase/changePassword/ChangePassword.useCase';

import { ChangeAvatarController } from './infra/api/controller/changeAvatar/ChangeAvatar.controller';
import { ChangeAvatarUseCase } from './useCase/changeAvatar/ChangeAvatar.useCase';

import { TokenGateway } from './infra/gateway/token/Token.gateway';
import { BucketGateway } from './infra/gateway/bucket/Bucket.gateway';

import { QueueRmqAdapter } from './infra/adapter/queue/rmq/QueueRmq.adapter';

import {
  TOKEN_GATEWAY,
  AUTH_QUEUE,
  BUCKET_GATEWAY,
  DATABASE_GATEWAY,
  QUEUE_ADAPTER,
} from './utils/constants';
import { TOKEN_SECRET, TOKEN_EXP } from '@shared/utils/constants';

@Module({
  imports: [
    PrismaModule,
    AwsModule,
    RmqModule.register(AUTH_QUEUE),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>(TOKEN_SECRET),
          signOptions: {
            expiresIn: configService.getOrThrow<string>(TOKEN_EXP),
          },
        };
      },
    }),
  ],
  exports: [GetMeUseCase],
  controllers: [
    CreateUserController,
    GetMeController,
    LoginController,
    RecoverPasswordController,
    ChangePasswordController,
    ChangeAvatarController,
  ],
  providers: [
    CreateUserUseCase,
    GetMeUseCase,
    LoginUseCase,
    RecoverPasswordUseCase,
    ChangePasswordUseCase,
    ChangeAvatarUseCase,
    {
      provide: TOKEN_GATEWAY,
      useClass: TokenGateway,
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
