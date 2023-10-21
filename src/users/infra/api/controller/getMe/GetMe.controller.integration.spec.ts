import type { Request } from 'express';

import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { from } from 'rxjs';

import { GetMeController } from './GetMe.controller';

import { GetMeUseCase } from '@users/useCase/getMe/GetMe.useCase';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';
import { AUTH_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

const USER = RANDOM_USER_MOCK();
const { id: userId } = USER;

describe('Integration tests for Get Me controller', () => {
  const client = new PrismaClient();

  let userController: GetMeController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GetMeController],
      providers: [
        GetMeUseCase,
        {
          provide: DATABASE_GATEWAY,
          useValue: new DatabaseGateway(client),
        },
        {
          provide: AUTH_GATEWAY,
          useValue: {
            verify: jest.fn().mockResolvedValue(from([{ userId }])),
          },
        },
        {
          provide: 'TOKEN_SERVICE',
          useValue: {
            verifyToken: jest.fn().mockResolvedValue({ userId }),
          },
        },
      ],
    }).compile();

    userController = module.get<GetMeController>(GetMeController);
  });

  describe('should get a user', () => {
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
      const response = await userController.handleRest({
        user: { userId },
      } as Request);

      expect(response).not.toBeNull();
      expect(response).toStrictEqual({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        lastUpdate: expect.any(Date),
        createdAt: expect.any(Date),
      });
    });

    it('with gRPC request', async () => {
      const newUser = await userController.handleGrpc({
        user: { userId },
      } as Request);

      expect(newUser).not.toBeNull();
      expect(newUser).toStrictEqual({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        lastUpdate: expect.any(Date),
        createdAt: expect.any(Date),
      });
    });
  });
});
