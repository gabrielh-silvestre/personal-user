import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type { IDatabaseAdapter } from '@users/infra/adapter/database/Database.adapter.interface';

import { ChangePasswordUseCase } from './ChangePassword.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ id, password: oldPass }] = USERS_MOCK;
const NEW_PASSWORD = 'new-password';

describe('Integration test for ChangePassword use case', () => {
  let databaseAdapter: IDatabaseAdapter;
  let databaseGateway: IDatabaseGateway;

  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    databaseAdapter = new UserDatabaseMemoryAdapter();
    databaseGateway = new DatabaseGateway(databaseAdapter);

    changePasswordUseCase = new ChangePasswordUseCase(databaseGateway);
  });

  it('should change password with success', async () => {
    await changePasswordUseCase.execute({
      id,
      newPassword: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    });

    const { password: newPass } = await databaseGateway.find(id);

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
