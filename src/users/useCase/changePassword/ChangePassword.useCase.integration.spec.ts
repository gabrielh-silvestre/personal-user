import type { IUserRepository } from '@users/domain/repository/user.repository.interface';
import type { IUserDatabaseAdapter } from '@users/infra/adapter/database/UserDatabase.adapter.interface';

import { ChangePasswordUseCase } from './ChangePassword.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { UserRepository } from '@users/infra/repository/User.repository';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ id, password: oldPass }] = USERS_MOCK;

describe('Integration test for ChangePassword use case', () => {
  let userDatabaseAdapter: IUserDatabaseAdapter;
  let userRepository: IUserRepository;

  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    userDatabaseAdapter = new UserDatabaseMemoryAdapter();
    userRepository = new UserRepository(userDatabaseAdapter);

    changePasswordUseCase = new ChangePasswordUseCase(userRepository);
  });

  it('should change password with success', async () => {
    await changePasswordUseCase.execute({
      id,
      newPassword: 'new-password',
    });

    const { password: newPass } = await userRepository.find(id);

    expect(newPass).not.toEqual(oldPass);
  });

  it('should throw an error if user is not found', async () => {
    await expect(
      changePasswordUseCase.execute({
        id: 'invalid-id',
        newPassword: 'new-password',
      }),
    ).rejects.toThrow('User not found');
  });
});
