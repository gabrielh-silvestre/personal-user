import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@shared/modules/prisma/Prisma.module';
import { PrismaService } from '@shared/modules/prisma/Prisma.service';

import { RecoverPasswordUseCase } from '@users/useCase/recoverPassword/RecoverPassword.useCase';
import { RecoverPasswordController } from './RecoverPassword.controller';

import { TokenGateway } from '@users/infra/gateway/token/Token.gateway';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';
import { TOKEN_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

const USER = RANDOM_USER_MOCK();
const { email } = USER;

describe('Integration tests for RecoverPassword controller', () => {
  let client: PrismaService;

  let recoverPasswordController: RecoverPasswordController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule.register({ secret: 'secret' })],
      controllers: [RecoverPasswordController],
      providers: [
        RecoverPasswordUseCase,
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
    recoverPasswordController = module.get(RecoverPasswordController);
  });

  describe('should send an email for password recovery', () => {
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
      const response = await recoverPasswordController.handleRestPost({
        email,
      });

      expect(response).toBeUndefined();
    });

    it('with REST (GET) request', async () => {
      const response = await recoverPasswordController.handleRestGet(email);

      expect(response).toBeUndefined();
    });

    it('with gRPC request', async () => {
      const response = await recoverPasswordController.handleGrpc({
        email,
      });

      expect(response).toStrictEqual({ success: true });
    });
  });
});
