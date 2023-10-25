import { Test } from '@nestjs/testing';

import { PrismaModule } from '@shared/modules/prisma/Prisma.module';
import { PrismaService } from '@shared/modules/prisma/Prisma.service';

import { CreateUserController } from './CreateUser.controller';
import { CreateUserUseCase } from '@users/useCase/create/CreateUser.useCase';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { DATABASE_GATEWAY } from '@users/utils/constants';

const VALID_NEW_USER = {
  username: 'Joe',
  email: 'joe@email.com',
  confirmEmail: 'joe@email.com',
  password: 'password',
  confirmPassword: 'password',
};

describe('Integration test for Create User controller', () => {
  let client: PrismaService;

  let userController: CreateUserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CreateUserController],
      providers: [
        CreateUserUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
        },
      ],
    }).compile();

    client = module.get<PrismaService>(PrismaService);
    userController = module.get<CreateUserController>(CreateUserController);
  });

  describe('should create a user', () => {
    beforeEach(async () => {
      await client.user.deleteMany({});
    });

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
