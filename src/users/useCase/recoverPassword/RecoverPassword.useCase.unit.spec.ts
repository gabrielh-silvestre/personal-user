import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { RecoverPasswordUseCase } from './RecoverPassword.useCase';

describe('Unit tests for RecoverPassword use case', () => {
  let databaseGateway: IDatabaseGateway;

  let authGateway: IAuthGateway;

  let recoverPasswordUseCase: RecoverPasswordUseCase;

  let spyGenerateRecoverPasswordToken: jest.SpyInstance;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    authGateway = {
      generateRecoverPasswordToken: jest.fn(),
      verify: jest.fn(),
    };

    spyGenerateRecoverPasswordToken = jest.spyOn(
      authGateway,
      'generateRecoverPasswordToken',
    );

    recoverPasswordUseCase = new RecoverPasswordUseCase(
      databaseGateway,
      authGateway,
    );
  });

  it('should throw an error if user not found', async () => {
    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(null);

    spyGenerateRecoverPasswordToken.mockReset();

    await expect(
      recoverPasswordUseCase.execute({ email: 'invalid_email@email.com' }),
    ).rejects.toThrowError('Email not registered');

    expect(spyGenerateRecoverPasswordToken).not.toHaveBeenCalled();
  });
});
