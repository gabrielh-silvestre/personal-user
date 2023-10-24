import type { Request } from 'express';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';
import { ChangePasswordController } from './ChangePassword.controller';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';
import { AUTH_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

const USER = RANDOM_USER_MOCK();
const { id, password: oldPassword } = USER;
const VALID_PASSWORD_CHANGE = {
  password: 'new-password',
  confirmPassword: 'new-password',
};

describe('Integration test for ChangePassword controller', () => {
  const client = new PrismaClient();

  let changePasswordController: ChangePasswordController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ChangePasswordController],
      providers: [
        ChangePasswordUseCase,
        {
          provide: DATABASE_GATEWAY,
          useValue: new DatabaseGateway(client),
        },
        {
          provide: AUTH_GATEWAY,
          useValue: {
            verify: jest.fn().mockResolvedValue({ userId: id }),
          },
        },
      ],
    }).compile();

    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController,
    );
  });

  describe('should change password', () => {
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

    it('with REST request', async () => {
      console.log(await client.user.findUnique({ where: { id } }));

      await changePasswordController.handleRest(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await client.user.findUnique({
        where: { id },
      });

      expect(newPassword).not.toEqual(oldPassword);
    });

    it('with gRPC request', async () => {
      console.log(await client.user.findUnique({ where: { id } }));

      await changePasswordController.handleGrpc(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await client.user.findUnique({
        where: { id },
      });

      expect(newPassword).not.toEqual(oldPassword);
    });
  });
});
