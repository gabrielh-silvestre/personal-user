import { from } from 'rxjs';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';

import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { RecoverPasswordUseCase } from './RecoverPassword.useCase';

import { AuthGateway } from '@users/infra/gateway/auth/Auth.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [USER] = USERS_MOCK;
const { id, email } = USER;

describe('Unit tests for RecoverPassword use case', () => {
  let databaseGateway: IDatabaseGateway;

  let queueAdapter: IQueueAdapter;
  let authGateway: IAuthGateway;

  let recoverPasswordUseCase: RecoverPasswordUseCase;

  const spyGenerateRecoverPasswordToken = jest.spyOn(
    AuthGateway.prototype,
    'generateRecoverPasswordToken',
  );

  beforeEach(() => {
    queueAdapter = {
      send: jest.fn().mockReturnValue(from('fake-message')),
      emit: jest.fn(),
    };

    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(USER);

    authGateway = new AuthGateway(queueAdapter);

    recoverPasswordUseCase = new RecoverPasswordUseCase(
      databaseGateway,
      authGateway,
    );
  });

  it('should recover password with success', async () => {
    await recoverPasswordUseCase.execute({ email });

    expect(spyGenerateRecoverPasswordToken).toHaveBeenCalledTimes(1);
    expect(spyGenerateRecoverPasswordToken).toHaveBeenCalledWith(id);
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
