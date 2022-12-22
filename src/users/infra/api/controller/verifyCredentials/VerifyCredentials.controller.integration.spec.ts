import { Test } from '@nestjs/testing';

import { VerifyCredentialsController } from './VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';
import { DatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';

import { RmqService } from '@shared/modules/rmq/rmq.service';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import {
  USER_DATABASE_ADAPTER,
  DATABASE_GATEWAY,
} from '@users/utils/constants';

const [{ email }] = USERS_MOCK;

describe('Integration tests for Verify Credentials controller', () => {
  let verifyCredentialsController: VerifyCredentialsController;

  beforeEach(async () => {
    DatabaseMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [VerifyCredentialsController],
      providers: [
        VerifyCredentialsUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: USER_DATABASE_ADAPTER,
          useClass: DatabaseMemoryAdapter,
        },
        {
          provide: RmqService,
          useValue: {
            ack: jest.fn(),
            nack: jest.fn(),
          },
        },
      ],
    }).compile();

    verifyCredentialsController = module.get<VerifyCredentialsController>(
      VerifyCredentialsController,
    );
  });

  describe('should verify credentials', () => {
    it('with RMQ message', async () => {
      const response = await verifyCredentialsController.handleRmq(
        {
          email,
          password: 'password',
        },
        {} as any,
      );

      expect(response).toStrictEqual({ id: expect.any(String) });
    });
  });
});
