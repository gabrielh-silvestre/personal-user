import type { IUserRepository } from '@users/domain/repository/user.repository.interface';
import type { IUserDatabaseAdapter } from '@users/infra/adapter/database/UserDatabase.adapter.interface';

import { ChangePasswordUseCase } from './ChangePassword.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ id, password: oldPass }] = USERS_MOCK;
const NEW_PASSWORD = 'new-password';

describe('Integration test for ChangePassword use case', () => {
  let userDatabaseAdapter: IUserDatabaseAdapter;
  let userRepository: IUserRepository;

  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    userDatabaseAdapter = new UserDatabaseMemoryAdapter();
    userRepository = new DatabaseGateway(userDatabaseAdapter);

    changePasswordUseCase = new ChangePasswordUseCase(userRepository);
  });

  it('should change password with success', async () => {
    await changePasswordUseCase.execute({
      id,
      newPassword: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    });

    const { password: newPass } = await userRepository.find(id);

    expect(newPass).not.toEqual(oldPass);
  });

  it('should throw an error if passwords does not match', async () => {
    await expect(
      changePasswordUseCase.execute({
        id,
        newPassword: NEW_PASSWORD,
        confirmPassword: 'password',
      }),
    ).rejects.toThrow('Passwords do not match');
  });

  it('should throw an error if user is not found', async () => {
    await expect(
      changePasswordUseCase.execute({
        id: 'invalid-id',
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD,
      }),
    ).rejects.toThrow('User not found');
  });
});
