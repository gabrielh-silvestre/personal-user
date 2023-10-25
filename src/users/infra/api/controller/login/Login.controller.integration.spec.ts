import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

import { LoginController } from './Login.controller';
import { LoginUseCase } from '@users/useCase/login/Login.useCase';

import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';
import { TokenGateway } from '@users/infra/gateway/token/Token.gateway';
import { RmqService } from '@shared/modules/rmq/rmq.service';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';
import { TOKEN_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

const [USER] = USERS_MOCK;
const { email } = USER;

describe('Integration tests for Verify Credentials controller', () => {
  const client = new PrismaClient();

  let loginController: LoginController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [LoginController],
      providers: [
        LoginUseCase,
        {
          provide: DATABASE_GATEWAY,
          useValue: new DatabaseGateway(client),
        },
        {
          provide: TOKEN_GATEWAY,
          useClass: TokenGateway,
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

    loginController = module.get<LoginController>(LoginController);
  });

  describe('should login credentials', () => {
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

    it('with REST (POST) request', async () => {
      const response = await loginController.handleRestPost({
        email,
        password: 'password',
      });

      expect(response).toStrictEqual({
        token: expect.any(String),
        user: {
          id: expect.any(String),
          email: expect.any(String),
        },
      });
    });
  });
});
