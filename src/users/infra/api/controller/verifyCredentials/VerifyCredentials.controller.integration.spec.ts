import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { VerifyCredentialsController } from './VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';
import { RmqService } from '@shared/modules/rmq/rmq.service';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import { DATABASE_GATEWAY } from '@users/utils/constants';

const [USER] = USERS_MOCK;
const { email } = USER;

describe('Integration tests for Verify Credentials controller', () => {
  const client = new PrismaClient();

  let verifyCredentialsController: VerifyCredentialsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [VerifyCredentialsController],
      providers: [
        VerifyCredentialsUseCase,
        {
          provide: DATABASE_GATEWAY,
          useValue: new DatabaseGateway(client),
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
    beforeEach(async () => {
      await client.user.create({
        data: {
          ...USER.toDto(),
          password: USER.password.toString(),
        },
      });
    });

    afterEach(async () => {
      await client.user.deleteMany({});
    });

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
