import { Test } from '@nestjs/testing';

import { RecoverPasswordUseCase } from '@users/useCase/recoverPassword/RecoverPassword.useCase';
import { RecoverPasswordController } from './RecoverPassword.controller';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import {
  AUTH_GATEWAY,
  MAIL_GATEWAY,
  DATABASE_GATEWAY,
  ORM_ADAPTER,
} from '@users/utils/constants';
import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';

const [{ email }] = USERS_MOCK;

describe('Integration tests for RecoverPassword controller', () => {
  let recoverPasswordController: RecoverPasswordController;

  beforeEach(async () => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [RecoverPasswordController],
      providers: [
        RecoverPasswordUseCase,
        {
          provide: ORM_ADAPTER,
          useClass: OrmMemoryAdapter,
        },
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: AUTH_GATEWAY,
          useValue: {
            generateRecoverPasswordToken: jest.fn().mockResolvedValue('token'),
          },
        },
        {
          provide: MAIL_GATEWAY,
          useValue: {
            recoverPasswordMail: jest.fn(),
          },
        },
      ],
    }).compile();

    recoverPasswordController = module.get(RecoverPasswordController);
  });

  describe('should send an email for password recovery', () => {
    it('with REST (POST) request', async () => {
      const response = await recoverPasswordController.handleRestPost({
        email,
      });

      expect(response).toBeUndefined();
    });

    it('with REST (GET) request', async () => {
      const response = await recoverPasswordController.handleRestGet(email);

      expect(response).toBeUndefined();
    });

    it('with gRPC request', async () => {
      const response = await recoverPasswordController.handleGrpc({
        email,
      });

      expect(response).toStrictEqual({ success: true });
    });
  });
});
