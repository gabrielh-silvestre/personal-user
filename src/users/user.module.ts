import { Module } from '@nestjs/common';

import { RmqModule } from '@shared/modules/rmq/rmq.module';

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

import { AuthGateway } from './infra/gateway/auth/Auth.gateway';

import { MailPresenter } from './infra/presenter/mail/Mail.presenter';
import { MailGateway } from './infra/gateway/mail/Mail.gateway';

import { QueueRmqAdapter } from './infra/adapter/queue/rmq/QueueRmq.adapter';

import { TemplateEngineEjsAdapter } from './infra/adapter/template/ejs/TemplateEngineEjs.adapter';

import {
  AUTH_GATEWAY,
  AUTH_QUEUE,
  MAIL_GATEWAY,
  MAIL_PRESENTER,
  MAIL_QUEUE,
  TEMPLATE_ADAPTER,
  DATABASE_GATEWAY,
  QUEUE_ADAPTER,
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
      provide: MAIL_PRESENTER,
      useClass: MailPresenter,
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
      provide: TEMPLATE_ADAPTER,
      useClass: TemplateEngineEjsAdapter,
    },
    {
      provide: QUEUE_ADAPTER,
      useClass: QueueRmqAdapter,
    },
  ],
})
export class UserModule {}
