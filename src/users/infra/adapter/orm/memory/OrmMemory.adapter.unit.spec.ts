import type { IOrmAdapter } from '../Orm.adapter.interface';

import { UserFactory } from '@users/domain/factory/User.factory';

import { OrmMemoryAdapter } from './OrmMemory.adapter';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Unit test infra OrmMemoryAdapter', () => {
  let ormAdapter: IOrmAdapter;

  beforeEach(() => {
    OrmMemoryAdapter.reset(USERS_MOCK);
    ormAdapter = new OrmMemoryAdapter();
  });

  it('should return all users', async () => {
    const users = await ormAdapter.findAll();

    expect(users.length).toBe(USERS_MOCK.length);
  });

  it('should find a user by id', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await ormAdapter.findOne({ id: userToFind.id });

    expect(foundUser).not.toBeNull();
  });

  it('should find a user by email', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await ormAdapter.findOne({ email: userToFind.email });

    expect(foundUser).not.toBeNull();
  });

  it('should create a user', async () => {
    const newUser = UserFactory.create('Joe', 'joe@email.com', 'password');
    await ormAdapter.create({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password.toString(),
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    const foundUser = await ormAdapter.findOne({ id: newUser.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Joe');
    expect(foundUser?.email).toBe('joe@email.com');
  });

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johny');

    await ormAdapter.update({
      id: userToUpdate.id,
      username: userToUpdate.username,
      email: userToUpdate.email,
      password: userToUpdate.password.toString(),
      createdAt: userToUpdate.createdAt,
      updatedAt: userToUpdate.updatedAt,
    });

    const foundUser = await ormAdapter.findOne({ id: userToUpdate.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Johny');
    expect(foundUser?.email).toBe(userToUpdate.email);
  });
});
