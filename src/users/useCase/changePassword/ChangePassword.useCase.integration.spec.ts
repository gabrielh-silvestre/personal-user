import type { IOrmAdapter } from '@users/infra/adapter/orm/Orm.adapter.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { ChangePasswordUseCase } from './ChangePassword.useCase';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import {
  FAKE_EVENT_DISPATCHER,
  USERS_MOCK,
} from '@shared/utils/mocks/users.mock';

const [{ id, password: oldPass }] = USERS_MOCK;
const NEW_PASSWORD = 'new-password';

describe('Integration test for ChangePassword use case', () => {
  let ormAdapter: IOrmAdapter;
  let databaseGateway: IDatabaseGateway;

  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    ormAdapter = new OrmMemoryAdapter();
    databaseGateway = new DatabaseGateway(ormAdapter);

    changePasswordUseCase = new ChangePasswordUseCase(
      databaseGateway,
      FAKE_EVENT_DISPATCHER,
    );
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
