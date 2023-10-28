import type { Request } from 'express';

import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@shared/modules/prisma/Prisma.module';
import { PrismaService } from '@shared/modules/prisma/Prisma.service';

import { TokenGateway } from '@users/infra/gateway/token/Token.gateway';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';
import { ChangePasswordController } from './ChangePassword.controller';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';
import { DATABASE_GATEWAY, TOKEN_GATEWAY } from '@users/utils/constants';

const USER = RANDOM_USER_MOCK();
const { id, password: oldPassword } = USER;
const VALID_PASSWORD_CHANGE = {
  password: 'new-password',
  confirmPassword: 'new-password',
};

describe('Integration test for ChangePassword controller', () => {
  let client: PrismaService;

  let changePasswordController: ChangePasswordController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule.register({ secret: 'secret' })],
      controllers: [ChangePasswordController],
      providers: [
        ChangePasswordUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: TOKEN_GATEWAY,
          useClass: TokenGateway,
        },
      ],
    }).compile();

    client = module.get<PrismaService>(PrismaService);
    changePasswordController = module.get<ChangePasswordController>(
      ChangePasswordController,
    );
  });

  describe('should change password', () => {
    beforeEach(async () => {
      await client.user
        .create({
          data: {
            ...USER.toDto(),
            password: USER.password.toString(),
          },
        })
        .catch(() => null);
    });

    afterEach(async () => {
      await client.user.deleteMany({});
    });

    it('with REST request', async () => {
      await changePasswordController.handleRest(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const { password: newPassword } = await client.user.findUnique({
        where: { id },
      });

      expect(newPassword).not.toEqual(oldPassword.toString());
    });

    it('with gRPC request', async () => {
      await changePasswordController.handleGrpc(
        { user: { userId: id } } as Request,
        VALID_PASSWORD_CHANGE,
      );

      const updatedUser = await client.user.findUnique({
        where: { id },
      });

      expect(updatedUser?.password).not.toEqual(oldPassword.toString());
    });
  });
});
