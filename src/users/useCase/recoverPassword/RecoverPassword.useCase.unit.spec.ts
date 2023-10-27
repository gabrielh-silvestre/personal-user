import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { RecoverPasswordUseCase } from './RecoverPassword.useCase';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Unit tests for RecoverPassword use case', () => {
  let databaseGateway: IDatabaseGateway;

  let authGateway: ITokenGateway;

  let emitter: EventEmitter2;

  let recoverPasswordUseCase: RecoverPasswordUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    authGateway = {
      validate: jest.fn(),
      generate: jest.fn(),
    };

    emitter = {
      emitAsync: jest.fn(),
    } as any;

    recoverPasswordUseCase = new RecoverPasswordUseCase(
      databaseGateway,
      authGateway,
      emitter,
    );
  });

  it('should generate a token to recover password', async () => {
    jest
      .mocked(databaseGateway.findByEmail)
      .mockResolvedValue(RANDOM_USER_MOCK());

    await recoverPasswordUseCase.execute({ email: 'any_email' });

    expect(authGateway.generate).toHaveBeenCalledTimes(1);
    expect(emitter.emitAsync).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if user not found', async () => {
    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(null);

    await expect(
      recoverPasswordUseCase.execute({ email: 'invalid_email@email.com' }),
    ).rejects.toThrowError('Email not registered');

    expect(authGateway.generate).not.toHaveBeenCalled();
    expect(emitter.emitAsync).not.toHaveBeenCalled();
  });
});
