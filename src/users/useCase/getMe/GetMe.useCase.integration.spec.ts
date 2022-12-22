import type { IDatabaseAdapter } from '@users/infra/adapter/database/Database.adapter.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { GetMeUseCase } from './GetMe.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Integration tests for Get User by id use case', () => {
  let databaseAdapter: IDatabaseAdapter;
  let databaseGateway: IDatabaseGateway;

  let getMeUseCase: GetMeUseCase;

  beforeEach(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);

    databaseAdapter = new UserDatabaseMemoryAdapter();
    databaseGateway = new DatabaseGateway(databaseAdapter);

    getMeUseCase = new GetMeUseCase(databaseGateway);
  });

  it('should get a user by id with success', async () => {
    const user = await getMeUseCase.execute(USERS_MOCK[0].id);

    expect(user).not.toBeNull();
    expect(user).toStrictEqual({
      id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      lastUpdate: expect.any(Date),
      createdAt: expect.any(Date),
    });
  });

  it('should throw an error if user is not found', async () => {
    await expect(getMeUseCase.execute('invalid-id')).rejects.toThrow(
      'User not found',
    );
  });
});
