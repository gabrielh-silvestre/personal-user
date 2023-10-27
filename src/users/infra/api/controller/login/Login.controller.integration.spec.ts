import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@shared/modules/prisma/Prisma.module';
import { PrismaService } from '@shared/modules/prisma/Prisma.service';

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
  let client: PrismaService;

  let loginController: LoginController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule.register({ secret: 'secret' })],
      controllers: [LoginController],
      providers: [
        LoginUseCase,
        {
          provide: DATABASE_GATEWAY,
          useClass: DatabaseGateway,
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

    client = module.get<PrismaService>(PrismaService);
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
