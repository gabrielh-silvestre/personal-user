import { PrismaClient } from '@prisma/client';

import type { IDatabaseGateway } from './Database.gateway.interface';

import { DatabaseGateway } from './Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Integration test infra DatabaseGateway', () => {
  const client = new PrismaClient();
  let databaseGateway: IDatabaseGateway;

  beforeAll(async () => {
    await client.$connect();
    await client.user.deleteMany({});
  });

  beforeEach(() => {
    databaseGateway = new DatabaseGateway(client);
  });

  it('should create a user', async () => {
    const [newUser] = USERS_MOCK;

    await databaseGateway.create(newUser);
    const foundUser = await client.user.findUnique({
      where: { id: newUser.id },
    });

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBeDefined();
    expect(foundUser?.username).toBe(newUser.username);
    expect(foundUser?.email).toBe(newUser.email);
  });

  it('should find a user by id', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await databaseGateway.find(userToFind.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.id).toBe(userToFind.id);
  });

  it('should find a user by email', async () => {
    const [userToFind] = USERS_MOCK;

    const foundUser = await databaseGateway.findByEmail(userToFind.email);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(userToFind.email);
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

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johnny');

    await databaseGateway.update(userToUpdate);
    const foundUser = await databaseGateway.find(userToUpdate.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.username).toBe('Johnny');
  });
});
