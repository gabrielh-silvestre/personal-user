import { v4 as uuid } from 'uuid';

import type { IOrmAdapter, OrmUserDto } from '../Orm.adapter.interface';

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
    const newUser: OrmUserDto = {
      id: uuid(),
      username: 'Joe',
      email: 'joe@email.com',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ormAdapter.create(newUser);
    const foundUser = await ormAdapter.findOne({ id: newUser.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Joe');
    expect(foundUser?.email).toBe('joe@email.com');
  });

  it('should update a user', async () => {
    const [user] = USERS_MOCK;
    const userToUpdate: OrmUserDto = {
      id: user.id,
      username: 'Johny',
      email: user.email,
      password: user.password.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await ormAdapter.update(userToUpdate);
    const foundUser = await ormAdapter.findOne({ id: userToUpdate.id });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe('Johny');
    expect(foundUser?.email).toBe(userToUpdate.email);
  });
});
