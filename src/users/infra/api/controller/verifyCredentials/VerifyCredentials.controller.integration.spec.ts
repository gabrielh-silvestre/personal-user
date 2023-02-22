import { Test } from '@nestjs/testing';

import { VerifyCredentialsController } from './VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { RmqService } from '@shared/modules/rmq/rmq.service';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import { DATABASE_GATEWAY, ORM_ADAPTER } from '@users/utils/constants';

const [{ email }] = USERS_MOCK;

describe('Integration tests for Verify Credentials controller', () => {
  let verifyCredentialsController: VerifyCredentialsController;

  beforeEach(async () => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [VerifyCredentialsController],
      providers: [
        VerifyCredentialsUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: ORM_ADAPTER,
          useClass: OrmMemoryAdapter,
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
