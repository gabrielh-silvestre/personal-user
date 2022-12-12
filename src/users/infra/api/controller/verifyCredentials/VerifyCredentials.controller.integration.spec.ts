import { Test } from '@nestjs/testing';

import { VerifyCredentialsController } from './VerifyCredentials.controller';
import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { UserRepository } from '@users/infra/repository/User.repository';
import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import { USER_DATABASE_ADAPTER, USER_REPOSITORY } from '@users/utils/constants';

const [{ email }] = USERS_MOCK;

describe('Integration tests for Verify Credentials controller', () => {
  let verifyCredentialsController: VerifyCredentialsController;

  beforeEach(async () => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [VerifyCredentialsController],
      providers: [
        VerifyCredentialsUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
        {
          provide: USER_DATABASE_ADAPTER,
          useClass: UserDatabaseMemoryAdapter,
        },
      ],
    }).compile();

    verifyCredentialsController = module.get<VerifyCredentialsController>(
      VerifyCredentialsController,
    );
  });

  describe('should verify credentials', () => {
    it('with gRPC request', async () => {
      const response = await verifyCredentialsController.handleGrpc({
        email,
        password: 'password',
      });

      expect(response).toStrictEqual({ id: expect.any(String) });
    });
  });
});
