import type { IDatabaseAdapter } from '../Database.adapter.interface';

import { UserFactory } from '@users/domain/factory/User.factory';

import { DatabaseMemoryAdapter } from './DatabaseMemory.adapter';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Unit test infra UserMemory gateway', () => {
  let userGateway: IDatabaseAdapter;

  beforeEach(() => {
    DatabaseMemoryAdapter.reset(USERS_MOCK);
    userGateway = new DatabaseMemoryAdapter();
  });

  it('should return all users', async () => {
    const users = await userGateway.findAll();

    expect(users.length).toBe(USERS_MOCK.length);
  });

  it('should find a user by id', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await userGateway.findOne({ id: userToFind.id });

    expect(foundUser).not.toBeNull();
  });

  it('should find a user by email', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await userGateway.findOne({ email: userToFind.email });

    expect(foundUser).not.toBeNull();
  });

  it('should create a user', async () => {
    const newUser = UserFactory.create('Joe', 'joe@email.com', 'password');

    await userGateway.create(newUser);

    const foundUser = await userGateway.findOne({ id: newUser.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Joe');
    expect(foundUser?.email).toBe('joe@email.com');
  });

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johny');

    await userGateway.update(userToUpdate);

    const foundUser = await userGateway.findOne({ id: userToUpdate.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Johny');
    expect(foundUser?.email).toBe(userToUpdate.email);
  });
});
