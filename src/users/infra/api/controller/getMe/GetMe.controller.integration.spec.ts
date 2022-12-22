import type { Request } from 'express';

import { Test } from '@nestjs/testing';
import { from } from 'rxjs';

import { GetMeController } from './GetMe.controller';

import { GetMeUseCase } from '@users/useCase/getMe/GetMe.useCase';

import { DatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import {
  AUTH_GATEWAY,
  USER_DATABASE_ADAPTER,
  DATABASE_GATEWAY,
} from '@users/utils/constants';

describe('Integration tests for Get Me controller', () => {
  let userController: GetMeController;
  const [{ id: userId }] = USERS_MOCK;

  beforeEach(async () => {
    DatabaseMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [GetMeController],
      providers: [
        GetMeUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: USER_DATABASE_ADAPTER,
          useClass: DatabaseMemoryAdapter,
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
