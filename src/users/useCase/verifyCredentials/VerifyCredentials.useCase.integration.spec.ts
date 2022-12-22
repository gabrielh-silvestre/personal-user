import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { IDatabaseAdapter } from '@users/infra/adapter/database/Database.adapter.interface';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';
import { VerifyCredentialsUseCase } from './VerifyCredentials.useCase';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ email }] = USERS_MOCK;

describe('Integration tests for Verify Credentials use case', () => {
  let databaseAdapter: IDatabaseAdapter;
  let databaseGateway: IDatabaseGateway;

  let verifyCredentialsUseCase: VerifyCredentialsUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    databaseAdapter = new UserDatabaseMemoryAdapter();
    databaseGateway = new DatabaseGateway(databaseAdapter);

    verifyCredentialsUseCase = new VerifyCredentialsUseCase(databaseGateway);
  });

  it('should verify credentials with success', async () => {
    const user = await verifyCredentialsUseCase.execute({
      email,
      password: 'password',
    });

    expect(user).not.toBeNull();
    expect(user).toStrictEqual({ id: expect.any(String) });
  });

  it('should throw an error if user is not found', async () => {
    await expect(
      verifyCredentialsUseCase.execute({
        email: 'invalid-email',
        password: 'invalid-password',
      }),
    ).rejects.toThrow('User not found');
  });

  it('should throw an error if password is invalid', async () => {
    await expect(
      verifyCredentialsUseCase.execute({
        email,
        password: 'invalid-password',
      }),
    ).rejects.toThrow('Invalid credentials');
  });
});
