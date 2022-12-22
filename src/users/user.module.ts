import { Module } from '@nestjs/common';

import { RmqModule } from '@shared/modules/rmq/rmq.module';

import { UserDatabasePrismaAdapter } from './infra/adapter/database/prisma/UserPrisma.adapter';
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

import { AuthRmqAdapter } from './infra/adapter/auth/rmq/AuthRmq.adapter';
import { AuthGateway } from './infra/gateway/auth/Auth.gateway';

import { MailRmqAdapter } from './infra/adapter/mail/rmq/MailRmq.adapter';
import { MailPresenter } from './infra/presenter/mail/Mail.presenter';
import { MailGateway } from './infra/gateway/mail/Mail.gateway';

import { TemplateEngineEjsAdapter } from './infra/adapter/template/ejs/TemplateEngineEjs.adapter';

import {
  AUTH_ADAPTER,
  AUTH_GATEWAY,
  AUTH_QUEUE,
  MAIL_ADAPTER,
  MAIL_GATEWAY,
  MAIL_PRESENTER,
  MAIL_QUEUE,
  TEMPLATE_ADAPTER,
  USER_DATABASE_ADAPTER,
  DATABASE_GATEWAY,
} from './utils/constants';

@Module({
  imports: [RmqModule.register(MAIL_QUEUE), RmqModule.register(AUTH_QUEUE)],
  exports: [GetMeUseCase],
  controllers: [
    CreateUserController,
    GetMeController,
    VerifyCredentialsController,
    RecoverPasswordController,
    ChangePasswordController,
  ],
  providers: [
    CreateUserUseCase,
    GetMeUseCase,
    VerifyCredentialsUseCase,
    RecoverPasswordUseCase,
    ChangePasswordUseCase,
    {
      provide: MAIL_GATEWAY,
      useClass: MailGateway,
    },
    {
      provide: MAIL_ADAPTER,
      useClass: MailRmqAdapter,
    },
    {
      provide: MAIL_PRESENTER,
      useClass: MailPresenter,
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
      provide: DATABASE_GATEWAY,
      useClass: DatabaseGateway,
    },
    {
      provide: USER_DATABASE_ADAPTER,
      useClass: UserDatabasePrismaAdapter,
    },
    {
      provide: TEMPLATE_ADAPTER,
      useClass: TemplateEngineEjsAdapter,
    },
  ],
})
export class UserModule {}
