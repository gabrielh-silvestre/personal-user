import type { IUserDatabaseAdapter } from '@users/infra/adapter/database/UserDatabase.adapter.interface';

import { GetMeUseCase } from './GetMe.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { UserRepository } from '@users/infra/repository/User.repository';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Integration tests for Get User by id use case', () => {
  let userDatabaseGateway: IUserDatabaseAdapter;
  let userRepository: UserRepository;

  let getMeUseCase: GetMeUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    userDatabaseGateway = new UserDatabaseMemoryAdapter();
    userRepository = new UserRepository(userDatabaseGateway);

    getMeUseCase = new GetMeUseCase(userRepository);
  });

  it('should get a user by id with success', async () => {
    const user = await getMeUseCase.execute(USERS_MOCK[0].id);

    expect(user).not.toBeNull();
  });

  it('should throw an error if user is not found', async () => {
    await expect(getMeUseCase.execute('invalid-id')).rejects.toThrow(
      'User not found',
    );
  });
});
