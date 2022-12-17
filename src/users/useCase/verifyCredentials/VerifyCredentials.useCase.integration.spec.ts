import type { IUserRepository } from '@users/domain/repository/user.repository.interface';
import type { IUserDatabaseAdapter } from '@users/infra/adapter/database/UserDatabase.adapter.interface';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { UserRepository } from '@users/infra/repository/User.repository';
import { VerifyCredentialsUseCase } from './VerifyCredentials.useCase';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ email }] = USERS_MOCK;

describe('Integration tests for Verify Credentials use case', () => {
  let userDatabaseAdapter: IUserDatabaseAdapter;
  let userRepository: IUserRepository;

  let verifyCredentialsUseCase: VerifyCredentialsUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    userDatabaseAdapter = new UserDatabaseMemoryAdapter();
    userRepository = new UserRepository(userDatabaseAdapter);

    verifyCredentialsUseCase = new VerifyCredentialsUseCase(userRepository);
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
