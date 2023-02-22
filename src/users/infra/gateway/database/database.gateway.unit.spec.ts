import type { IOrmAdapter } from '@users/infra/adapter/orm/Orm.adapter.interface';
import type { IDatabaseGateway } from './Database.gateway.interface';

import { UserFactory } from '@users/domain/factory/User.factory';

import { DatabaseGateway } from './Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const ORM_ADAPTER: IOrmAdapter = {
  create: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('Unit test infra DatabaseGateway', () => {
  let databaseGateway: IDatabaseGateway;

  beforeEach(() => {
    databaseGateway = new DatabaseGateway(ORM_ADAPTER);
  });

  it('should find a user by id', async () => {
    const [userToFind] = USERS_MOCK;

    await databaseGateway.find(userToFind.id);

    expect(ORM_ADAPTER.findOne).toHaveBeenCalledWith({ id: userToFind.id });
  });

  it('should find a user by email', async () => {
    const [userToFind] = USERS_MOCK;

    await databaseGateway.findByEmail(userToFind.email);

    expect(ORM_ADAPTER.findOne).toHaveBeenCalledWith({
      email: userToFind.email,
    });
  });

  it('should return true if user exists by email', async () => {
    const [userToFind] = USERS_MOCK;

    await databaseGateway.existsByEmail(userToFind.email);

    expect(ORM_ADAPTER.findOne).toHaveBeenCalledWith({
      email: userToFind.email,
    });
  });

  it('should return false if user does not exist by email', async () => {
    await databaseGateway.existsByEmail('non-existing-email');

    expect(ORM_ADAPTER.findOne).toHaveBeenCalledWith({
      email: 'non-existing-email',
    });
  });

  it('should create a user', async () => {
    const newUser = UserFactory.create('Joe', 'joe@email.com', 'password');
    await databaseGateway.create(newUser);

    expect(ORM_ADAPTER.create).toHaveBeenCalledWith({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password.toString(),
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  });

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johnny');

    await databaseGateway.update(userToUpdate);

    expect(ORM_ADAPTER.update).toHaveBeenCalledWith({
      id: userToUpdate.id,
      username: userToUpdate.username,
      email: userToUpdate.email,
      password: userToUpdate.password.toString(),
      createdAt: userToUpdate.createdAt,
      updatedAt: userToUpdate.updatedAt,
    });
  });
});
