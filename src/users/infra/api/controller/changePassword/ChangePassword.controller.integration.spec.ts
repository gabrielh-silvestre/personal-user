import type { Request } from 'express';
import { Test } from '@nestjs/testing';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';
import { ChangePasswordController } from './ChangePassword.controller';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import {
  AUTH_GATEWAY,
  DATABASE_GATEWAY,
  ORM_ADAPTER,
} from '@users/utils/constants';

const [{ id, password: oldPassword }] = USERS_MOCK;
const VALID_PASSWORD_CHANGE = {
  password: 'new-password',
  confirmPassword: 'new-password',
};

describe('Integration test for ChangePassword controller', () => {
  let databaseGateway: DatabaseGateway;

  let changePasswordController: ChangePasswordController;

  beforeEach(async () => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        ChangePasswordUseCase,
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
            verify: jest.fn().mockResolvedValue({ userId: id }),
          },
        },
      ],
    }).compile();

    databaseGateway = module.get<DatabaseGateway>(DATABASE_GATEWAY);
    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController,
    );
  });

  describe('should change password', () => {
    it('with REST request', async () => {
      await changePasswordController.handleRest(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await databaseGateway.find(id);

      expect(newPassword).not.toEqual(oldPassword);
    });

    it('with gRPC request', async () => {
      await changePasswordController.handleGrpc(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await databaseGateway.find(id);

      expect(newPassword).not.toEqual(oldPassword);
    });
  });
});
