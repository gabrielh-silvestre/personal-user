import type { IOrmAdapter } from '@users/infra/adapter/orm/Orm.adapter.interface';
import type { IDatabaseGateway } from './Database.gateway.interface';

import { UserFactory } from '@users/domain/factory/User.factory';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from './Database.gateway';

import {
  FAKE_EVENT_DISPATCHER,
  USERS_MOCK,
} from '@shared/utils/mocks/users.mock';

describe('Integration test infra DatabaseGateway', () => {
  let databaseAdapter: IOrmAdapter;
  let databaseGateway: IDatabaseGateway;

  beforeEach(() => {
    OrmMemoryAdapter.reset(USERS_MOCK);

    databaseAdapter = new OrmMemoryAdapter();
    databaseGateway = new DatabaseGateway(databaseAdapter);
  });

  it('should find a user by id', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await databaseGateway.find(userToFind.id);

    expect(foundUser).not.toBeNull();
  });

  it('should find a user by email', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await databaseGateway.findByEmail(userToFind.email);

    expect(foundUser).not.toBeNull();
  });

  it('should return true if user exists by email', async () => {
    const [userToFind] = USERS_MOCK;

    const exists = await databaseGateway.existsByEmail(userToFind.email);

    expect(exists).toBeTruthy();
  });

  it('should return false if user does not exist by email', async () => {
    const exists = await databaseGateway.existsByEmail('non-existing-email');

    expect(exists).toBeFalsy();
  });

  it('should create a user', async () => {
    const newUser = UserFactory.create(
      FAKE_EVENT_DISPATCHER,
      'Joe',
      'joe@email.com',
      'password',
    );

    await databaseGateway.create(newUser);

    const foundUser = await databaseGateway.find(newUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Joe');
    expect(foundUser?.email).toBe('joe@email.com');
  });

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johnny', FAKE_EVENT_DISPATCHER);

    await databaseGateway.update(userToUpdate);

    const foundUser = await databaseGateway.find(userToUpdate.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.username).toBe('Johnny');
  });
});