import type { Request } from 'express';
import { Test } from '@nestjs/testing';

import type { IUserRepository } from '@users/domain/repository/user.repository.interface';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';
import { ChangePasswordController } from './ChangePassword.controller';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import {
  AUTH_GATEWAY,
  USER_DATABASE_ADAPTER,
  DATABASE_GATEWAY,
} from '@users/utils/constants';

const [{ id, password: oldPassword }] = USERS_MOCK;
const VALID_PASSWORD_CHANGE = {
  password: 'new-password',
  confirmPassword: 'new-password',
};

describe('Integration test for ChangePassword controller', () => {
  let userRepository: IUserRepository;

  let changePasswordController: ChangePasswordController;

  beforeEach(async () => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        ChangePasswordUseCase,
        {
          provide: USER_DATABASE_ADAPTER,
          useClass: UserDatabaseMemoryAdapter,
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

    userRepository = module.get<IUserRepository>(DATABASE_GATEWAY);
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

      const { password: newPassword } = await userRepository.find(id);

      expect(newPassword).not.toEqual(oldPassword);
    });

    it('with gRPC request', async () => {
      await changePasswordController.handleGrpc(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await userRepository.find(id);

      expect(newPassword).not.toEqual(oldPassword);
    });
  });
});
