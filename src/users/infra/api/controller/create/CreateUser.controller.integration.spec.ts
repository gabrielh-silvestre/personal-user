import { Test } from '@nestjs/testing';

import { CreateUserController } from './CreateUser.controller';
import { CreateUserUseCase } from '@users/useCase/create/CreateUser.useCase';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import {
  FAKE_EVENT_DISPATCHER,
  USERS_MOCK,
} from '@shared/utils/mocks/users.mock';
import {
  DATABASE_GATEWAY,
  ORM_ADAPTER,
  EVENT_DISPATCHER,
} from '@users/utils/constants';

const VALID_NEW_USER = {
  username: 'Joe',
  email: 'joe@email.com',
  confirmEmail: 'joe@email.com',
  password: 'password',
  confirmPassword: 'password',
};

describe('Integration test for Create User controller', () => {
  let userController: CreateUserController;

  beforeEach(async () => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    const module = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        CreateUserUseCase,
        {
          provide: ORM_ADAPTER,
          useClass: OrmMemoryAdapter,
        },
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
        {
          provide: EVENT_DISPATCHER,
          useValue: FAKE_EVENT_DISPATCHER,
        },
      ],
    }).compile();

    userController = module.get<CreateUserController>(CreateUserController);
  });

  describe('should create a user', () => {
    it('with REST request', async () => {
      const response = await userController.handleRest(VALID_NEW_USER);

      expect(response).not.toBeNull();
      expect(response).toStrictEqual({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        lastUpdate: expect.any(Date),
        created: expect.any(Date),
      });
    });

    it('with gRPC request', async () => {
      const newUser = await userController.handleGrpc(VALID_NEW_USER);

      expect(newUser).not.toBeNull();
      expect(newUser).toStrictEqual({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        lastUpdate: expect.any(Date),
        created: expect.any(Date),
      });
    });
  });
});
